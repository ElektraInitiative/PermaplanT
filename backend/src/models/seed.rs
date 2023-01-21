use crate::{config::db::Connection, schema::seeds};
use bigdecimal::BigDecimal;
use chrono::NaiveDate;
use diesel::prelude::*;
use serde::{Deserialize, Serialize};

#[derive(Identifiable, Queryable, Serialize, Deserialize)]
pub struct Seed {
    pub id: i32,
    pub name: String,
    pub variety_id: i32,
}
#[derive(Insertable, Serialize, Deserialize)]
#[table_name = "seeds"]
pub struct NewSeed {
    pub name: String,
    pub variety_id: i32,
    pub harvest_year: i16,
    pub use_by: Option<NaiveDate>,
    pub origin: Option<String>,
    pub taste: Option<String>,
    pub yield_: Option<String>,
    pub generation: Option<i32>,
    pub notes: Option<String>,
}

impl Seed {
    pub fn create(conn: &mut Connection, new_seed: NewSeed) -> QueryResult<usize> {
        diesel::insert_into(seeds::table)
            .values(&new_seed)
            .execute(conn)
    }
}
