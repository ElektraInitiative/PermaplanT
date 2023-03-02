use crate::schema::plants::{self, all_columns};
use diesel::{Identifiable, QueryDsl, QueryResult, Queryable, RunQueryDsl};

use crate::config::db::Connection;

use super::dto::plants_dto::PlantsDTO;

#[derive(Identifiable, Queryable)]
#[diesel(table_name = plants)]
pub struct Plants {
    pub id: i32,
    pub tags: Vec<Option<String>>,
    pub species: String,
    pub plant: Option<String>,
}

impl Plants {
    pub fn find_all(conn: &mut Connection) -> QueryResult<Vec<PlantsDTO>> {
        let query_result = plants::table.select(all_columns).load::<Self>(conn);
        query_result.map(|v| v.into_iter().map(Into::into).collect())
    }
}
