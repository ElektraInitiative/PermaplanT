use crate::{config::db::Connection, schema::seeds};
use diesel::prelude::*;
use diesel_derive_enum::DbEnum;
use serde::{Deserialize, Serialize};

#[derive(DbEnum, Debug)]
pub enum Tag {
    Foo,
    Bar,
}

#[derive(Identifiable, Queryable, Serialize, Deserialize)]
pub struct Seed {
    pub id: i32,
    pub username: String,
    pub email: String,
    pub password: String,
    pub login_session: String,
}

#[derive(Insertable)]
#[table_name = "seeds"]
pub struct SeedDTO<'a> {
    pub variety_id: i32,
    pub tags: &'a [Tag],
}

impl Seed {
    pub fn create(conn: &mut Connection, title: &str, body: &str) -> Seed {
        let new_seed = SeedDTO {
            variety_id: 1,
            tags: &[Tag::Foo, Tag::Bar],
        };

        diesel::insert_into(seeds::table)
            .values(&new_seed)
            .get_result(conn)
            .expect("Error saving new post")
    }
}
