//! Contains the implementation of [`Plants`].

use diesel::{ExpressionMethods, PgTextExpressionMethods, QueryDsl, QueryResult};
use diesel_async::{AsyncPgConnection, RunQueryDsl};
use diesel::dsl::sql;
use diesel::sql_types::{Bool, Text};

use crate::{
    model::diesel_extensions::array_to_string,
    model::dto::{PlantsSearchDto, PlantsSummaryDto},
    schema::plants::{self, all_columns, binomial_name, common_name, common_name_de},
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

    /// Search all plants whose name or species name exactly matches the user provided query string.
    /// To save traffic, the maximum number of results is limited.
    ///
    /// # Errors
    /// * Unknown, diesel doesn't say why it might error.
    pub async fn search_exact(
        search_term: &String,
        limit: i32,
        offset: i32,
        conn: &mut AsyncPgConnection,
    ) -> QueryResult<PlantsSearchDto> {
        // Load one additional row to check whether there are more pages available.
        let limit_plus_one = limit + 1;

        let query = plants::table
            .filter(
                binomial_name.eq::<String>(search_term.to_string())
            )
            .filter(
                // Feel free to change if there is a way to this without raw sql.
                sql::<Bool>("")
                .bind::<Text, _>(search_term)
                .sql(" = ANY(common_name) OR ")
                .bind::<Text, _>(search_term)
                .sql(" = ANY(common_name_de)")
            )
            .select(all_columns)
            .order((binomial_name, common_name))
            .limit(limit_plus_one.into())
            .offset(offset.into());

        let query_result = query.load::<Self>(conn).await;
        Self::map_plant_search_query(query_result, limit).await
    }

    // How can we avoid code duplication here?

    /// Search all plants by their latin name.
    /// To save traffic, the maximum number of results is limited.
    ///
    /// # Errors
    /// * Unknown, diesel doesn't say why it might error.
    pub async fn search_plant_latin_name(
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
                binomial_name.ilike(&query_with_placeholders)
            )
            .select(all_columns)
            .order((binomial_name, common_name))
            .limit(limit_plus_one.into())
            .offset(offset.into());

        let query_result = query.load::<Self>(conn).await;
        Self::map_plant_search_query(query_result, limit).await
    }

    /// Search all plants by their english name.
    /// To save traffic, the maximum number of results is limited.
    ///
    /// # Errors
    /// * Unknown, diesel doesn't say why it might error.
    pub async fn search_plant_english_name(
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
               array_to_string(common_name, " ").ilike(&query_with_placeholders)
            )
            .select(all_columns)
            .order((binomial_name, common_name))
            .limit(limit_plus_one.into())
            .offset(offset.into());

        let query_result = query.load::<Self>(conn).await;
        Self::map_plant_search_query(query_result, limit).await
    }

    /// Search all plants by german english name.
    /// To save traffic, the maximum number of results is limited.
    ///
    /// # Errors
    /// * Unknown, diesel doesn't say why it might error.
    pub async fn search_plant_german_name(
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
               array_to_string(common_name_de, " ").ilike(&query_with_placeholders)
            )
            .select(all_columns)
            .order((binomial_name, common_name))
            .limit(limit_plus_one.into())
            .offset(offset.into());

        let query_result = query.load::<Self>(conn).await;
        Self::map_plant_search_query(query_result, limit).await
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

    async fn map_plant_search_query(query_result: QueryResult<Vec<Plants>>, limit: i32) -> QueryResult<PlantsSearchDto> {
        let limit_plus_one = limit + 1; 
        
        query_result.map(|v| {
            let results: Vec<PlantsSummaryDto> = v.into_iter().map(Into::into).collect();
            let results_len = results.len();
            // Perform an explicit conversion to make clippy happy.
            let unsigned_limit = limit.unsigned_abs() as usize;
            let unsigned_limit_plus_one = limit_plus_one.unsigned_abs() as usize;

            PlantsSearchDto {
                plants: results.into_iter().take(unsigned_limit).collect(),
                // If there is at least one more element than the defined limit,
                // more pages may still be loaded.
                has_more: results_len == unsigned_limit_plus_one,
            }
        })
    }
}
