//! Contains the implementation of [`Plants`].

use diesel::{BoolExpressionMethods, PgTextExpressionMethods, QueryDsl, QueryResult};
use diesel_async::{AsyncPgConnection, RunQueryDsl};

use crate::{
    model::diesel_extensions::array_to_string,
    model::dto::{PlantsSearchDto, PlantsSummaryDto},
    schema::plants::{self, all_columns, binomial_name, common_name},
};

use super::Plants;

impl Plants {
    /// Fetch all plants from the database.
    ///
    /// # Errors
    /// * Unknown, diesel doesn't say why it might error.
    pub async fn find_all(conn: &mut AsyncPgConnection) -> QueryResult<Vec<PlantsSummaryDto>> {
        let query_result = plants::table.select(all_columns).load::<Self>(conn).await;
        query_result.map(|v| v.into_iter().map(Into::into).collect())
    }

    /// Search all plants whose name or species name contains the user provided query string.
    /// To save traffic, the maximum number of results is limited.
    ///
    /// # Errors
    /// * Unknown, diesel doesn't say why it might error.
    pub async fn search(
        search_term: &String,
        limit: i32,
        offset: i32,
        conn: &mut AsyncPgConnection,
    ) -> QueryResult<PlantsSearchDto> {
        let query_with_placeholders = format!("%{search_term}%");
        // Load one additional row to check whether there are more pages available.
        let limit_plus_one = limit + 1;

        let query = plants::table
            .filter(
                binomial_name
                    .ilike(&query_with_placeholders)
                    .or(array_to_string(common_name, " ").ilike(&query_with_placeholders)),
            )
            .select(all_columns)
            .order((binomial_name, common_name))
            .limit(limit_plus_one.into())
            .offset(offset.into());

        let query_result = query.load::<Self>(conn).await;
        query_result.map(|v| {
            let results: Vec<PlantsSummaryDto> = v.into_iter().map(Into::into).collect();
            let results_len = results.len();

            PlantsSearchDto {
                plants: results.into_iter().take(limit as usize).collect(),
                // If there is at least one more element than the defined limit,
                // more pages may still be loaded.
                has_more: results_len == limit_plus_one as usize,
            }
        })
    }

    /// Fetch plant by id from the database.
    ///
    /// # Errors
    /// * Unknown, diesel doesn't say why it might error.
    pub async fn find_by_id(
        id: i32,
        conn: &mut AsyncPgConnection,
    ) -> QueryResult<PlantsSummaryDto> {
        let query_result = plants::table.find(id).first::<Self>(conn).await;
        query_result.map(Into::into)
    }
}
