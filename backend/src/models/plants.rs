//! [`Plants`] entity and its implementation.

use crate::schema::plants::{self, all_columns};
use diesel::{Identifiable, PgConnection, QueryDsl, QueryResult, Queryable, RunQueryDsl};

use super::dto::plants_dto::PlantsDTO;

/// The `Plants` entity.
#[allow(clippy::missing_docs_in_private_items)] // TODO: document
#[derive(Identifiable, Queryable)]
#[diesel(table_name = plants)]
pub struct Plants {
    pub id: i32,
    pub tags: Vec<Option<String>>,
    pub species: String,
    pub plant: Option<String>,
    pub plant_type: Option<i32>,
}

impl Plants {
    /// Fetch all plants from the database.
    ///
    /// # Errors
    /// * Unknown, diesel doesn't say why it might error.
    pub fn find_all(conn: &mut PgConnection) -> QueryResult<Vec<PlantsDTO>> {
        let query_result = plants::table.select(all_columns).load::<Self>(conn);
        query_result.map(|v| v.into_iter().map(Into::into).collect())
    }
}
