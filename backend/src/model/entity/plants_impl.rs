//! Contains the implementation of [`Plants`].

use diesel::{
    dsl::sql,
    sql_types::{Float, Text},
    BoolExpressionMethods, ExpressionMethods, PgTextExpressionMethods, QueryDsl, QueryResult,
};
use diesel_async::{AsyncPgConnection, RunQueryDsl};

use crate::{
    db::{
        function::{array_to_string, fuzzy},
        pagination::Paginate,
    },
    model::dto::{Page, PageParameters, PlantsSearchParameters, PlantsSummaryDto},
    schema::plants::{
        self, all_columns, common_name_de, common_name_en, edible_uses_en, unique_name,
    },
};

use super::Plants;

impl Plants {
    /// Get the top plants matching the search query.
    ///
    /// Uses `pg_trgm` to find matches in `unique_name`, `common_name_de`, `common_name_en` and `edible_uses_en`.
    /// Ranks them using the `pg_trgm` function `similarity()`.
    ///
    /// # Errors
    /// * Unknown, diesel doesn't say why it might error.
    pub async fn search(
        search_query: &str,
        page_parameters: PageParameters,
        conn: &mut AsyncPgConnection,
    ) -> QueryResult<Page<PlantsSummaryDto>> {
        let query = format!("{search_query}");

        // needs to be raw SQL as 'AS rank' cannot be represented by diesel, other functions could be created via the macro sql_function!
        let rank_sql = sql::<Float>("greatest(similarity(unique_name, ")
            .bind::<Text, _>(&query)
            .sql("), similarity(ARRAY_TO_STRING(common_name_de, ' '), ")
            .bind::<Text, _>(&query)
            .sql("), similarity(ARRAY_TO_STRING(common_name_en, ' '), ")
            .bind::<Text, _>(&query)
            .sql("), similarity(edible_uses_en, ")
            .bind::<Text, _>(&query)
            .sql(")) AS rank");
        let sql_query = plants::table
            .select((plants::all_columns, rank_sql))
            .filter(
                fuzzy(unique_name, &query)
                    .or(fuzzy(array_to_string(common_name_de, " "), &query))
                    .or(fuzzy(array_to_string(common_name_en, " "), &query))
                    .or(fuzzy(edible_uses_en, &query)),
            )
            .order(sql::<Float>("rank").desc());

        let query_page = sql_query
            .paginate(page_parameters.page)
            .per_page(page_parameters.per_page)
            .load_page::<(Self, f32)>(conn)
            .await;
        query_page.map(Page::from_entity)
    }

    /// Get a page of plants.
    /// Can be filtered by name if one is provided in `search_parameters`.
    ///
    /// # Errors
    /// * Unknown, diesel doesn't say why it might error.
    pub async fn find(
        search_parameters: PlantsSearchParameters,
        page_parameters: PageParameters,
        conn: &mut AsyncPgConnection,
    ) -> QueryResult<Page<PlantsSummaryDto>> {
        let mut query = plants::table.select(all_columns).into_boxed();

        if let Some(term) = search_parameters.name {
            query = query
                .filter(
                    unique_name
                        .ilike(format!("%{term}%"))
                        .or(array_to_string(common_name_en, " ").ilike(format!("%{term}%"))),
                )
                .order((unique_name, common_name_en));
        }

        let query_page = query
            .paginate(page_parameters.page)
            .per_page(page_parameters.per_page)
            .load_page::<Self>(conn)
            .await;
        query_page.map(Page::from_entity)
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
