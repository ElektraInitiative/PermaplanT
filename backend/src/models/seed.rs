//! [`Seed`] entity and its implementation.

use crate::schema::seeds::{self, all_columns};
use chrono::NaiveDate;
use diesel::{
    Identifiable, Insertable, PgConnection, QueryDsl, QueryResult, Queryable, RunQueryDsl,
};

use super::{
    dto::{new_seed_dto::NewSeedDTO, seed_dto::SeedDTO},
    r#enum::{quality::Quality, quantity::Quantity},
};

/// The `Seed` entity.
#[allow(clippy::missing_docs_in_private_items)] // TODO: document
#[derive(Identifiable, Queryable)]
#[diesel(table_name = seeds)]
pub struct Seed {
    pub id: i32,
    pub name: String,
    pub plant_id: Option<i32>,
    pub harvest_year: i16,
    pub use_by: Option<NaiveDate>,
    pub origin: Option<String>,
    pub taste: Option<String>,
    pub yield_: Option<String>,
    pub quantity: Quantity,
    pub quality: Option<Quality>,
    pub price: Option<i16>,
    pub generation: Option<i16>,
    pub notes: Option<String>,
    pub variety: Option<String>
}

#[allow(clippy::missing_docs_in_private_items)] // TODO: document
#[derive(Insertable)]
#[diesel(table_name = seeds)]
pub struct NewSeed {
    pub name: String,
    pub plant_id: Option<i32>,
    pub harvest_year: i16,
    pub use_by: Option<NaiveDate>,
    pub origin: Option<String>,
    pub taste: Option<String>,
    pub yield_: Option<String>,
    pub quantity: Quantity,
    pub quality: Option<Quality>,
    pub price: Option<i16>,
    pub generation: Option<i16>,
    pub notes: Option<String>,
    pub variety: Option<String>
}

impl Seed {
    /// Fetch all seeds from the database.
    ///
    /// # Errors
    /// * Unknown, diesel doesn't say why it might error.
    pub fn find_all(conn: &mut PgConnection) -> QueryResult<Vec<SeedDTO>> {
        let query_result = seeds::table.select(all_columns).load::<Self>(conn);
        query_result.map(|v| v.into_iter().map(Into::into).collect())
    }

    /// Create a new seed in the database.
    ///
    /// # Errors
    /// * Unknown, diesel doesn't say why it might error.
    pub fn create(new_seed: NewSeedDTO, conn: &mut PgConnection) -> QueryResult<SeedDTO> {
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
