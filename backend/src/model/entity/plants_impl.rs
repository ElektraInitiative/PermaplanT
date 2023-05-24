//! Contains the implementation of [`Plants`].

use diesel::{BoolExpressionMethods, PgTextExpressionMethods, QueryDsl, QueryResult};
use diesel_async::{AsyncPgConnection, RunQueryDsl};

use crate::db::function::array_to_string;
use crate::db::pagination::{Paginate, DEFAULT_PER_PAGE, MIN_PAGE};
use crate::model::dto::{Page, PageParameters, PlantsSearchParameters};
use crate::{
    model::dto::PlantsSummaryDto,
    schema::plants::{
        self, all_columns, common_name_de, common_name_en, edible_uses_en, unique_name,
    },
};

use super::Plants;

impl Plants {
    /// Get the top plants matching the search query.
    ///
    /// Uses `pg_trgm` to find matches in `unique_name`, `common_name_de`, `common_name_en` and `edible_uses_en`.
    /// Ranks them using the `PostgreSQL` function `similarity()`.
    ///
    /// # Errors
    /// * Unknown, diesel doesn't say why it might error.
    pub async fn search(
        search_query: &str,
        page_parameters: PageParameters,
        conn: &mut AsyncPgConnection,
    ) -> QueryResult<Page<PlantsSummaryDto>> {
        let query = format!("%{search_query}%");
        let _limit = page_parameters.per_page.unwrap_or(DEFAULT_PER_PAGE);
        let _offset = page_parameters.page.unwrap_or(MIN_PAGE) * _limit;

        // This has to be a raw query as similarity() is a function provided by pg_trgm which diesel doesn't support
        // This is not SQL injectable as the query param is bound using diesel.
        let _query_sql = r#"
            SELECT *, COUNT(*),
                greatest(
                    similarity(unique_name, $1),
                    similarity(ARRAY_TO_STRING(common_name_de, ' '), $1),
                    similarity(ARRAY_TO_STRING(common_name_en, ' '), $1),
                    similarity(edible_uses_en, $1)
                ) AS rank
            FROM plants
            WHERE unique_name ILIKE $1
            OR ARRAY_TO_STRING(common_name_de, ' ') ILIKE $1
            OR ARRAY_TO_STRING(common_name_en, ' ') ILIKE $1
            OR edible_uses_en ILIKE $1
            ORDER BY rank DESC
            LIMIT $2 OFFSET $3
        "#;

        let sql_query = plants::table.select(plants::all_columns).filter(
            unique_name
                .ilike(&query)
                .or(array_to_string(common_name_de, " ").ilike(&query))
                .or(array_to_string(common_name_en, " ").ilike(&query))
                .or(edible_uses_en.ilike(&query)),
        );

        let query_page = sql_query
            .paginate(page_parameters.page)
            .per_page(page_parameters.per_page)
            .load_page::<Self>(conn)
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
