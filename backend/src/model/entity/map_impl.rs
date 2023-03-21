//! Contains the implementation of [`Map`].

use diesel::{PgConnection, QueryDsl, QueryResult, RunQueryDsl};

use crate::{
    model::dto::MapDto,
    schema::map::{self, all_columns},
};

use super::Map;

impl Map {
    /// Fetch all maps from the database.
    ///
    /// # Errors
    /// * Unknown, diesel doesn't say why it might error.
    pub fn find_all(conn: &mut PgConnection) -> QueryResult<Vec<MapDto>> {
        let query_result = map::table.select(all_columns).load::<Self>(conn);
        query_result.map(|v| v.into_iter().map(Into::into).collect())
    }
}
