use crate::{config::db::Connection, schema::seeds};
use bigdecimal::BigDecimal;
use chrono::NaiveDate;
use diesel::prelude::*;
use serde::{Deserialize, Serialize};
use typeshare::typeshare;

#[derive(Identifiable, Queryable, Serialize, Deserialize)]
pub struct Seed {
    pub id: i32,
    pub name: String,
    pub variety_id: i32,
    pub harvest_year: i16,
    pub quantity: String,
    pub tags: Vec<String>,
    pub use_by: Option<NaiveDate>,
    pub origin: Option<String>,
    pub taste: Option<String>,
    pub yield_: Option<String>,
    pub generation: Option<i32>,
    pub quality: Option<String>,
    pub price: Option<BigDecimal>,
    pub notes: Option<String>,
}

#[typeshare]
#[derive(Insertable, Serialize, Deserialize, Debug)]
#[diesel(table_name = seeds)]
pub struct NewSeed {
    pub name: String,
    pub variety_id: i32,
    pub harvest_year: i16,
    pub quantity: String,
    pub id: Option<i32>,
    pub tags: Vec<String>,
    pub use_by: Option<NaiveDate>,
    pub origin: Option<String>,
    pub taste: Option<String>,
    pub yield_: Option<String>,
    pub generation: Option<i32>,
    pub quality: Option<String>,
    pub price: Option<BigDecimal>,
    pub notes: Option<String>,
}

impl Seed {
    pub fn create(new_seed: NewSeed, conn: &mut Connection) -> QueryResult<usize> {
        diesel::insert_into(seeds::table)
            .values(&new_seed)
            .execute(conn)
    }

    pub fn delete_by_id(id: i32, conn: &mut Connection) -> QueryResult<usize> {
        diesel::delete(seeds::table.find(id)).execute(conn)
    }
}
