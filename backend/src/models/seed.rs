use crate::{
    config::db::Connection,
    schema::seeds::{self, all_columns},
};
use chrono::NaiveDate;
use diesel::prelude::*;

use super::dto::{new_seed_dto::NewSeedDTO, seed_dto::SeedDTO};

#[derive(Identifiable, Insertable, Queryable)]
#[diesel(table_name = seeds)]
pub struct Seed {
    pub id: i32,
    pub tags: Vec<Option<String>>,
    pub name: String,
    pub variety_id: i32,
    pub harvest_year: i16,
    pub use_by: Option<NaiveDate>,
    pub origin: Option<String>,
    pub taste: Option<String>,
    pub yield_: Option<String>,
    pub quantity: String,
    pub quality: Option<String>,
    pub price: Option<i16>,
    pub generation: Option<i16>,
    pub notes: Option<String>,
}

#[derive(Insertable)]
#[diesel(table_name = seeds)]
pub struct NewSeed {
    pub tags: Vec<Option<String>>,
    pub name: String,
    pub variety_id: i32,
    pub harvest_year: i16,
    pub use_by: Option<NaiveDate>,
    pub origin: Option<String>,
    pub taste: Option<String>,
    pub yield_: Option<String>,
    pub quantity: String,
    pub quality: Option<String>,
    pub price: Option<i16>,
    pub generation: Option<i16>,
    pub notes: Option<String>,
}

impl Seed {
    pub fn find_all(conn: &mut Connection) -> QueryResult<Vec<SeedDTO>> {
        let query_result = seeds::table.select(all_columns).load::<Seed>(conn);
        return query_result.map(|v| v.into_iter().map(|v| v.into()).collect());
    }

    pub fn create(new_seed: NewSeedDTO, conn: &mut Connection) -> QueryResult<usize> {
        diesel::insert_into(seeds::table)
            .values(NewSeed::from(new_seed))
            .execute(conn)
    }

    pub fn delete_by_id(id: i32, conn: &mut Connection) -> QueryResult<usize> {
        diesel::delete(seeds::table.find(id)).execute(conn)
    }
}
