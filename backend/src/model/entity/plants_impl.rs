//! Contains the implementation of [`Plants`].

use diesel::{QueryDsl, QueryResult};
use diesel_async::{AsyncPgConnection, RunQueryDsl};

use crate::{
    model::dto::PlantsDto,
    schema::plants::{self, all_columns},
};

use super::Plants;

impl Plants {
    /// Fetch all plants from the database.
    ///
    /// # Errors
    /// * Unknown, diesel doesn't say why it might error.
    pub async fn find_all(conn: &mut AsyncPgConnection) -> QueryResult<Vec<PlantsDto>> {
        let query_result = plants::table.select(all_columns).load::<Self>(conn).await;
        query_result.map(|v| v.into_iter().map(Into::into).collect())
    }

    /// Fetch plant by id from the database.
    ///
    /// # Errors
    /// * Unknown, diesel doesn't say why it might error.
    pub async fn find_by_id(id: i32, conn: &mut AsyncPgConnection) -> QueryResult<PlantsDto> {
        let query_result = plants::table.find(id).first::<Self>(conn).await;
        query_result.map(Into::into)
    }
}
