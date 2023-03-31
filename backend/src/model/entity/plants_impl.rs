//! Contains the implementation of [`Plants`].

use diesel::dsl::sql;
use diesel::sql_types::{Bool, Text};
use diesel::{PgConnection, QueryDsl, QueryResult, RunQueryDsl};

use crate::{
    model::dto::{PlantsSearchDto, QueryParameters},
    schema::plants::{self, all_columns, binomial_name, common_name},
};

use super::Plants;

impl Plants {
    /// Fetch all plants from the database.
    ///
    /// # Errors
    /// * Unknown, diesel doesn't say why it might error.
    pub fn find_all(conn: &mut PgConnection) -> QueryResult<Vec<PlantsSearchDto>> {
        let query_result = plants::table.select(all_columns).load::<Self>(conn);
        query_result.map(|v| v.into_iter().map(Into::into).collect())
    }

    /// Search all plants whose name or species name contains the user provided query string.
    /// To save traffic, the maximum number of results is limited.
    ///
    /// # Errors
    /// * Unknown, diesel doesn't say why it might error.
    pub fn search(
        query: &QueryParameters,
        conn: &mut PgConnection,
    ) -> QueryResult<Vec<PlantsSearchDto>> {
        let capitalized_query = query.search_term.to_lowercase();
        let query_with_placeholders = format!("%{}%", capitalized_query);

        let query = plants::table
            .select(all_columns)
            .filter(
                sql::<Bool>("LOWER(binomial_name) LIKE ")
                    .bind::<Text, _>(&query_with_placeholders)
                    .sql(" OR LOWER(ARRAY_TO_STRING(common_name, ' ')) LIKE ")
                    .bind::<Text, _>(&query_with_placeholders),
            )
            .order((binomial_name, common_name))
            .limit(query.limit as i64);

        let query_result = query.load::<Self>(conn);
        query_result.map(|v| v.into_iter().map(Into::into).collect())
    }
    
    /// Fetch plant by id from the database.
    ///
    /// # Errors
    /// * Unknown, diesel doesn't say why it might error.
    pub fn find_by_id(id: i32, conn: &mut PgConnection) -> QueryResult<PlantsSearchDto> {
        let query_result = plants::table.find(id).first::<Self>(conn);
        query_result.map(Into::into)
    }
}
