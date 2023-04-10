//! Contains the implementation of [`Plants`].

use diesel::{BoolExpressionMethods, PgTextExpressionMethods, QueryDsl, QueryResult};
use diesel_async::{AsyncPgConnection, RunQueryDsl};

use crate::{
    model::diesel_extensions::array_to_string,
    model::dto::{PlantsSearchParameters, PlantsSummaryDto},
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
        query: &PlantsSearchParameters,
        conn: &mut AsyncPgConnection,
    ) -> QueryResult<Vec<PlantsSummaryDto>> {
        let query_with_placeholders = format!("%{}%", query.search_term);

        let query = plants::table
            .filter(
                binomial_name
                    .ilike(&query_with_placeholders)
                    .or(array_to_string(common_name, " ").ilike(&query_with_placeholders)),
            )
            .select(all_columns)
            .order((binomial_name, common_name))
            .limit(query.limit.into());

        let query_result = query.load::<Self>(conn).await;
        query_result.map(|v| v.into_iter().map(Into::into).collect())
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
