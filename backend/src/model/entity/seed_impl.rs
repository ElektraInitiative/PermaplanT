//! Contains the implementation of [`Seed`].

use diesel::{ExpressionMethods, PgTextExpressionMethods, QueryDsl, QueryResult};
use diesel_async::{AsyncPgConnection, RunQueryDsl};

use crate::db::pagination::Paginate;
use crate::model::dto::{Page, PageParameters, SeedSearchParameters};
use crate::{
    model::dto::{NewSeedDto, SeedDto},
    schema::seeds::{self, all_columns, harvest_year, name},
};

use super::{NewSeed, Seed};

impl Seed {
    /// Get a page of seeds.
    ///
    /// # Errors
    /// * Unknown, diesel doesn't say why it might error.
    pub async fn find(
        search_parameters: SeedSearchParameters,
        page_parameters: PageParameters,
        conn: &mut AsyncPgConnection,
    ) -> QueryResult<Page<SeedDto>> {
        let mut query = seeds::table.select(all_columns).into_boxed();

        if let Some(name_search) = search_parameters.name {
            query = query.filter(name.ilike(format!("%{name_search}%")));
        }
        if let Some(harvest_year_search) = search_parameters.harvest_year {
            query = query.filter(harvest_year.eq(harvest_year_search));
        }

        let query_page = query
            .paginate(page_parameters.page)
            .per_page(page_parameters.per_page)
            .load_page::<Self>(conn)
            .await;
        query_page.map(Page::from_entity)
    }

    /// Fetch seed by id from the database.
    ///
    /// # Errors
    /// * Unknown, diesel doesn't say why it might error.
    pub async fn find_by_id(id: i32, conn: &mut AsyncPgConnection) -> QueryResult<SeedDto> {
        let query_result = seeds::table.find(id).first::<Self>(conn).await;
        query_result.map(Into::into)
    }

    /// Create a new seed in the database.
    ///
    /// # Errors
    /// * Unknown, diesel doesn't say why it might error.
    pub async fn create(
        new_seed: NewSeedDto,
        conn: &mut AsyncPgConnection,
    ) -> QueryResult<SeedDto> {
        let new_seed = NewSeed::from(new_seed);
        let query_result = diesel::insert_into(seeds::table)
            .values(&new_seed)
            .get_result::<Self>(conn)
            .await;
        query_result.map(Into::into)
    }

    /// Edits a seed in the database.
    ///
    /// # Errors
    /// * Unknown, diesel doesn't say why it might error.
    pub async fn edit(
        id: i32,
        new_seed: NewSeedDto,
        conn: &mut AsyncPgConnection,
    ) -> QueryResult<SeedDto> {
        let new_seed = NewSeed::from(new_seed);
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
    pub async fn delete_by_id(id: i32, conn: &mut AsyncPgConnection) -> QueryResult<usize> {
        diesel::delete(seeds::table.find(id)).execute(conn).await
    }
}
