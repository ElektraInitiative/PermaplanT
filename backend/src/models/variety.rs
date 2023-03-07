//! [`Variety`] entity and its implementation.

use crate::schema::varieties::{self, all_columns};
use diesel::{Identifiable, PgConnection, QueryDsl, QueryResult, Queryable, RunQueryDsl};

use super::dto::variety_dto::VarietyDTO;

#[allow(clippy::missing_docs_in_private_items)] // TODO: document
#[derive(Identifiable, Queryable)]
#[diesel(table_name = varieties)]
pub struct Variety {
    pub id: i32,
    pub tags: Vec<Option<String>>,
    pub species: String,
    pub variety: Option<String>,
}

impl Variety {
    /// Fetch all plants from the database.
    ///
    /// # Errors
    /// * Unknown, diesel doesn't say why it might error.
    pub fn find_all(conn: &mut PgConnection) -> QueryResult<Vec<VarietyDTO>> {
        let query_result = varieties::table.select(all_columns).load::<Self>(conn);
        query_result.map(|v| v.into_iter().map(Into::into).collect())
    }
}
