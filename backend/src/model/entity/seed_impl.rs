//! Contains the implementation of [`Seed`].

use diesel::{QueryDsl, QueryResult};
use diesel_async::{AsyncPgConnection, RunQueryDsl};

use crate::db::pagination::Paginate;
use crate::model::dto::{Page, PageParameters};
use crate::{
    model::dto::{NewSeedDto, SeedDto},
    schema::seeds::{self, all_columns},
};

use super::{NewSeed, Seed};

impl Seed {
    /// Get a page of seeds.
    ///
    /// # Errors
    /// * Unknown, diesel doesn't say why it might error.
    pub async fn find(
        page_parameters: PageParameters,
        conn: &mut AsyncPgConnection,
    ) -> QueryResult<Page<SeedDto>> {
        let query_page = seeds::table
            .select(all_columns)
            .paginate(page_parameters.page)
            .per_page(page_parameters.per_page)
            .load_page::<Self>(conn)
            .await;
        query_page.map(Page::from)
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

    /// Delete the seed from the database.
    ///
    /// # Errors
    /// * Unknown, diesel doesn't say why it might error.
    pub async fn delete_by_id(id: i32, conn: &mut AsyncPgConnection) -> QueryResult<usize> {
        diesel::delete(seeds::table.find(id)).execute(conn).await
    }
}
