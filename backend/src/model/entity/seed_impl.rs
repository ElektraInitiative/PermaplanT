//! Contains the implementation of [`Seed`].

use diesel::pg::Pg;
use diesel::{debug_query, BoolExpressionMethods, ExpressionMethods, QueryDsl, QueryResult};
use diesel_async::{AsyncPgConnection, RunQueryDsl};
use log::debug;
use uuid::Uuid;

use crate::db::{
    function::{array_to_string, greatest, similarity},
    pagination::Paginate,
};
use crate::model::dto::{Page, PageParameters, SeedSearchParameters};
use crate::{
    model::dto::{NewSeedDto, SeedDto},
    schema::{
        plants::{self, common_name_de, common_name_en, unique_name},
        seeds::{self, all_columns, harvest_year, name, owner_id, use_by},
    },
};

use crate::model::r#enum::include_archived_seeds::IncludeArchivedSeeds;
use chrono::NaiveDateTime;
use diesel::dsl::sql;
use diesel::sql_types::Float;

use super::{NewSeed, Seed};

impl Seed {
    /// Get a page of seeds.
    ///
    /// `search_parameters.name` filters seeds by their full names (as defined in the documentation).
    /// `search_parameters.harvest_year` will only include seeds with a specific harvest year.
    /// `search_parameters.archived` specifies if archived seeds, non archived seeds or both kinds
    /// should be part of the results.
    /// By default, archived seeds will not be returned.
    ///
    /// If `search_parameters.name` is set, seeds will be ordered by how similar they are to the
    /// `search_parameters.name`.
    /// Otherwise, seeds are returned in ascending order of their `use_by` and `harvest_year` dates.
    ///
    ///
    /// # Errors
    /// * Unknown, diesel doesn't say why it might error.
    pub async fn find(
        search_parameters: SeedSearchParameters,
        user_id: Uuid,
        page_parameters: PageParameters,
        conn: &mut AsyncPgConnection,
    ) -> QueryResult<Page<SeedDto>> {
        // Diesel allows only one select call per query.
        // We therefore always include similarity measures for the complete name,
        // even if we don't need them.
        let mut search_query = &String::new();
        if let Some(name_search) = &search_parameters.name {
            search_query = name_search;
        }

        let mut query = seeds::table
            .inner_join(plants::table)
            .select((
                greatest(
                    similarity(name, search_query),
                    similarity(unique_name, search_query),
                    similarity(array_to_string(common_name_de, " "), search_query),
                    similarity(array_to_string(common_name_en, " "), search_query),
                ),
                all_columns,
            ))
            .into_boxed();

        if let Some(harvest_year_search) = search_parameters.harvest_year {
            query = query.filter(harvest_year.eq(harvest_year_search));
        }

        if search_parameters.name.is_some() {
            query = query
                .filter(
                    similarity(name, search_query)
                        .gt(0.1)
                        .or(similarity(array_to_string(common_name_de, " "), search_query).gt(0.1))
                        .or(similarity(array_to_string(common_name_en, " "), search_query).gt(0.1))
                        .or(similarity(unique_name, search_query).gt(0.1)),
                )
                // Order seeds by how similar they are to the search term,
                // if one was set.
                .order(sql::<Float>("1").desc());
        } else {
            // By default, seeds should be ordered by either use_by date or harvest year.
            query = query.order((harvest_year.asc(), use_by.asc()));
        }

        let mut include_archived = IncludeArchivedSeeds::NotArchived;
        if let Some(include_archived_) = search_parameters.archived {
            include_archived = include_archived_;
        }

        // Don't filter the query if IncludeArchivedSeeds::Both is selected.
        if include_archived == IncludeArchivedSeeds::Archived {
            query = query.filter(seeds::archived_at.is_not_null());
        } else if include_archived == IncludeArchivedSeeds::NotArchived {
            query = query.filter(seeds::archived_at.is_null());
        }

        // Only return seeds that belong to the user.
        query = query.filter(owner_id.eq(user_id));

        let query = query
            .paginate(page_parameters.page)
            .per_page(page_parameters.per_page);
        debug!("{}", debug_query::<Pg, _>(&query));
        query
            .load_page::<(f32, Self)>(conn)
            .await
            .map(Page::from_entity)
    }

    /// Fetch seed by id from the database.
    ///
    /// # Errors
    /// * Unknown, diesel doesn't say why it might error.
    pub async fn find_by_id(
        id: i32,
        user_id: Uuid,
        conn: &mut AsyncPgConnection,
    ) -> QueryResult<SeedDto> {
        let mut query = seeds::table.select(all_columns).into_boxed();

        // Only return seeds that belong to the user.
        query = query.filter(owner_id.eq(user_id).and(seeds::id.eq(id)));

        debug!("{}", debug_query::<Pg, _>(&query));
        query.first::<Self>(conn).await.map(Into::into)
    }

    /// Create a new seed in the database.
    ///
    /// # Errors
    /// * Unknown, diesel doesn't say why it might error.
    pub async fn create(
        new_seed: NewSeedDto,
        user_id: Uuid,
        conn: &mut AsyncPgConnection,
    ) -> QueryResult<SeedDto> {
        let new_seed = NewSeed::from((new_seed, user_id));
        let query = diesel::insert_into(seeds::table).values(&new_seed);
        debug!("{}", debug_query::<Pg, _>(&query));
        query.get_result::<Self>(conn).await.map(Into::into)
    }

    /// Edits a seed in the database.
    ///
    /// # Errors
    /// * Unknown, diesel doesn't say why it might error.
    pub async fn edit(
        id: i32,
        user_id: Uuid,
        new_seed: NewSeedDto,
        conn: &mut AsyncPgConnection,
    ) -> QueryResult<SeedDto> {
        let new_seed = NewSeed::from((new_seed, user_id));
        let query_result = diesel::update(seeds::table.filter(seeds::id.eq(id)))
            .set((
                seeds::name.eq(new_seed.name),
                seeds::harvest_year.eq(new_seed.harvest_year),
                seeds::plant_id.eq(new_seed.plant_id),
                seeds::use_by.eq(new_seed.use_by),
                seeds::origin.eq(new_seed.origin),
                seeds::taste.eq(new_seed.taste),
                seeds::yield_.eq(new_seed.yield_),
                seeds::generation.eq(new_seed.generation),
                seeds::price.eq(new_seed.price),
                seeds::notes.eq(new_seed.notes),
                seeds::quantity.eq(new_seed.quantity),
                seeds::quality.eq(new_seed.quality),
            ))
            .get_result::<Self>(conn)
            .await;
        query_result.map(Into::into)
    }

    /// Delete the seed from the database.
    ///
    /// # Errors
    /// * Unknown, diesel doesn't say why it might error.
    pub async fn delete_by_id(
        id: i32,
        user_id: Uuid,
        conn: &mut AsyncPgConnection,
    ) -> QueryResult<usize> {
        // Only delete seeds that belong to the user.
        let source = seeds::table.filter(owner_id.eq(user_id).and(seeds::id.eq(id)));

        let query = diesel::delete(source);
        debug!("{}", debug_query::<Pg, _>(&query));
        query.execute(conn).await
    }

    /// Archive or unarchive a seed in the database.
    ///
    /// # Errors
    /// If the connection to the database could not be established.
    pub async fn archive(
        id: i32,
        archived_at: Option<NaiveDateTime>,
        user_id: Uuid,
        conn: &mut AsyncPgConnection,
    ) -> QueryResult<SeedDto> {
        let source = seeds::table.filter(owner_id.eq(user_id).and(seeds::id.eq(id)));

        let query_result = diesel::update(source)
            .set(seeds::archived_at.eq(archived_at))
            .get_result::<Self>(conn)
            .await;
        query_result.map(Into::into)
    }
}
