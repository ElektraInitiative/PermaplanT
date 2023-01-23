use crate::{config::db::Connection, schema::seeds};
use chrono::NaiveDate;
use diesel::prelude::*;
use serde::{Deserialize, Serialize};

use super::dto::new_seed_dto::NewSeedDTO;

#[derive(Identifiable, Insertable, Queryable, Serialize, Deserialize)]
#[diesel(table_name = seeds)]
pub struct Seed {
    pub id: Option<i32>,
    pub name: String,
    pub variety_id: i32,
    pub harvest_year: i16,
    pub quantity: String,
    pub tags: Vec<String>,
    pub use_by: Option<NaiveDate>,
    pub origin: Option<String>,
    pub taste: Option<String>,
    pub yield_: Option<String>,
    pub generation: Option<i16>,
    pub quality: Option<String>,
    pub price: Option<i16>,
    pub notes: Option<String>,
}

impl Seed {
    pub fn create(new_seed: NewSeedDTO, conn: &mut Connection) -> QueryResult<usize> {
        diesel::insert_into(seeds::table)
            .values(Seed::from(new_seed))
            .execute(conn)
    }

    pub fn delete_by_id(id: i32, conn: &mut Connection) -> QueryResult<usize> {
        diesel::delete(seeds::table.find(id)).execute(conn)
    }
}
