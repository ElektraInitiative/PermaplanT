use crate::schema::varieties::{self, all_columns};
use diesel::{Identifiable, QueryDsl, QueryResult, Queryable, RunQueryDsl};
use serde::{Deserialize, Serialize};

use crate::config::db::Connection;

#[derive(Identifiable, Queryable, Serialize, Deserialize)]
#[diesel(table_name = varieties)]
pub struct Variety {
    pub id: i32,
    pub tags: Vec<Option<String>>,
    pub species: String,
    pub variety: Option<String>,
}

impl Variety {
    pub fn find_all(conn: &mut Connection) -> QueryResult<Vec<Variety>> {
        varieties::table.select(all_columns).load::<Variety>(conn)
    }
}
