//! Contains the implementation of [`Seed`].

use diesel::pg::Pg;
use diesel::{
    debug_query, BoolExpressionMethods, ExpressionMethods, PgTextExpressionMethods, QueryDsl,
    QueryResult,
};
use diesel_async::{AsyncPgConnection, RunQueryDsl};
use log::debug;
use uuid::Uuid;

use crate::db::pagination::Paginate;
use crate::model::dto::{Page, PageParameters, SeedSearchParameters};
use crate::{
    model::dto::{NewSeedDto, SeedDto},
    schema::seeds::{self, all_columns, archived_at, harvest_year, name, owner_id, use_by},
};

use crate::model::r#enum::include_archived_seeds::IncludeArchivedSeeds;
use chrono::NaiveDateTime;

use super::{NewSeed, Seed};

impl Seed {
    /// Get a page of seeds.
    /// Seeds are returned in descending order of their `use_by` dates.
    /// If that is not available, the harvest year is used in ascending order.
    ///
    /// By default, archived seeds will not be returned.
    /// This behaviour can be changed using `search_parameters`.
    ///
    /// # Errors
    /// * Unknown, diesel doesn't say why it might error.
    pub async fn find(
        search_parameters: SeedSearchParameters,
        user_id: Uuid,
        page_parameters: PageParameters,
        conn: &mut AsyncPgConnection,
    ) -> QueryResult<Page<SeedDto>> {
        let mut query = seeds::table
            .select(all_columns)
            .order((harvest_year.asc(), use_by.asc()))
            .into_boxed();

        let mut include_archived = IncludeArchivedSeeds::NotArchived;

        if let Some(name_search) = search_parameters.name {
            query = query.filter(name.ilike(format!("%{name_search}%")));
        }
        if let Some(harvest_year_search) = search_parameters.harvest_year {
            query = query.filter(harvest_year.eq(harvest_year_search));
        }
        if let Some(include_archived_) = search_parameters.archived {
            include_archived = include_archived_;
        }

        // Don't filter the query if IncludeArchivedSeeds::Both is selected.
        if include_archived == IncludeArchivedSeeds::Archived {
            query = query.filter(archived_at.is_not_null());
        } else if include_archived == IncludeArchivedSeeds::NotArchived {
            query = query.filter(archived_at.is_null());
        }

        // Only return seeds that belong to the user.
        query = query.filter(owner_id.eq(user_id));

        let query = query
            .paginate(page_parameters.page)
            .per_page(page_parameters.per_page);
        debug!("{}", debug_query::<Pg, _>(&query));
        query.load_page::<Self>(conn).await.map(Page::from_entity)
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
                seeds::variety.eq(new_seed.variety),
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
        archived_at_: Option<NaiveDateTime>,
        user_id: Uuid,
        conn: &mut AsyncPgConnection,
    ) -> QueryResult<SeedDto> {
        let source = seeds::table.filter(owner_id.eq(user_id).and(seeds::id.eq(id)));

        let query_result = diesel::update(source)
            .set((seeds::archived_at.eq(archived_at_),))
            .get_result::<Self>(conn)
            .await;
        query_result.map(Into::into)
    }
}
