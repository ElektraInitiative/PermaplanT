use diesel::{PgConnection, QueryDsl, QueryResult, RunQueryDsl};

use crate::{
    model::dto::MapDto,
    schema::map::{self, all_columns},
};

use super::Map;

impl Map {
    pub fn find_all(conn: &mut PgConnection) -> QueryResult<Vec<MapDto>> {
        let query_result = map::table.select(all_columns).load::<Self>(conn);
        query_result.map(|v| v.into_iter().map(Into::into).collect())
    }

    pub fn find_by_id(conn: &mut PgConnection, id: i32) -> QueryResult<MapDto> {
        let query_result = map::table.find(id).first::<Self>(conn);
        query_result.map(Into::into)
    }
}
