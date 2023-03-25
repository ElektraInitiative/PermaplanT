//! Contains the implementation of [`Plants`].

use diesel::dsl::sql;
use diesel::sql_types::{Bool, Text};
use diesel::{PgConnection, QueryDsl, QueryResult, RunQueryDsl};

use crate::{
    model::dto::{PlantsDto, QueryParameters},
    schema::plants::{self, all_columns},
};

use super::Plants;

impl Plants {
    /// Fetch all plants from the database.
    ///
    /// # Errors
    /// * Unknown, diesel doesn't say why it might error.
    pub fn find_all(conn: &mut PgConnection) -> QueryResult<Vec<PlantsDto>> {
        let query_result = plants::table.select(all_columns).load::<Self>(conn);
        query_result.map(|v| v.into_iter().map(Into::into).collect())
    }

    /// Search all plants whose name or species name contains the user provided query string.
    /// To save traffic, the maximum number of results is limited.
    ///
    /// # Errors
    /// * Unknown, diesel doesn't say why it might error.
    pub fn search(query: &QueryParameters, conn: &mut PgConnection) -> QueryResult<Vec<PlantsDto>> {
        let query_with_placeholders = format!("%{}%", query.search_term);

        // We have to add some raw SQL, because the relevant columns
        // do not implement the TextExpressionMethods trait.
        let query_result = plants::table
            .select(all_columns)
            .filter(
                sql::<Bool>("species LIKE ")
                    .bind::<Text, _>(&query_with_placeholders)
                    .sql(" OR plant LIKE ")
                    .bind::<Text, _>(&query_with_placeholders),
            )
            .limit(query.limit)
            .load::<Self>(conn);

        query_result.map(|v| v.into_iter().map(Into::into).collect())
    }
}
