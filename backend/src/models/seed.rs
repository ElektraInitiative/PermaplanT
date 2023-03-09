use crate::{
    config::db::Connection,
    schema::seeds::{self, all_columns},
};
use chrono::NaiveDate;
use diesel::prelude::*;

use super::{
    dto::{new_seed_dto::NewSeedDTO, seed_dto::SeedDTO},
    r#enum::{quality::Quality, quantity::Quantity},
};

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
    pub fn find_all(conn: &mut Connection) -> QueryResult<Vec<SeedDTO>> {
        let query_result = seeds::table.select(all_columns).load::<Self>(conn);
        query_result.map(|v| v.into_iter().map(Into::into).collect())
    }

    pub fn create(new_seed: NewSeedDTO, conn: &mut Connection) -> QueryResult<SeedDTO> {
        let new_seed = NewSeed::from(new_seed);
        let query_result = diesel::insert_into(seeds::table)
            .values(&new_seed)
            .get_result::<Self>(conn);
        query_result.map(Into::into)
    }

    pub fn delete_by_id(id: i32, conn: &mut Connection) -> QueryResult<usize> {
        diesel::delete(seeds::table.find(id)).execute(conn)
    }
}
