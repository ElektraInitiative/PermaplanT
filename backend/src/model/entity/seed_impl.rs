//! Contains the implementation of [`Seed`].

use diesel::{PgConnection, QueryDsl, QueryResult, RunQueryDsl};

use crate::{
    model::dto::{NewSeedDto, SeedDto},
    schema::seeds::{self, all_columns},
};

use super::{NewSeed, Seed};

impl Seed {
    /// Fetch all seeds from the database.
    ///
    /// # Errors
    /// * Unknown, diesel doesn't say why it might error.
    pub fn find_all(conn: &mut PgConnection) -> QueryResult<Vec<SeedDto>> {
        let query_result = seeds::table.select(all_columns).load::<Self>(conn);
        query_result.map(|v| v.into_iter().map(Into::into).collect())
    }

    /// Create a new seed in the database.
    ///
    /// # Errors
    /// * Unknown, diesel doesn't say why it might error.
    pub fn create(new_seed: NewSeedDto, conn: &mut PgConnection) -> QueryResult<SeedDto> {
        let new_seed = NewSeed::from(new_seed);
        let query_result = diesel::insert_into(seeds::table)
            .values(&new_seed)
            .get_result::<Self>(conn);
        query_result.map(Into::into)
    }

    /// Delete the seed from the database.
    ///
    /// # Errors
    /// * Unknown, diesel doesn't say why it might error.
    pub fn delete_by_id(id: i32, conn: &mut PgConnection) -> QueryResult<usize> {
        diesel::delete(seeds::table.find(id)).execute(conn)
    }
}
