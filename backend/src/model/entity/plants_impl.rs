//! Contains the implementation of [`Plants`].

use diesel::{
    debug_query, dsl::sql, pg::Pg, sql_types::Float, BoolExpressionMethods, ExpressionMethods,
    QueryDsl, QueryResult,
};
use diesel_async::{AsyncPgConnection, RunQueryDsl};
use log::debug;

use crate::{
    db::{
        function::{
            array_to_string, greatest, similarity, similarity_nullable, AliasExpressionMethod,
            PgTrgmExpressionMethods,
        },
        pagination::Paginate,
    },
    model::dto::{Page, PageParameters, PlantsSummaryDto},
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
        // Set higher search sensitivity so that the user gets more search results than with default
        // settings (0.3).
        let set_similarity_threshold = diesel::sql_query("SET pg_trgm.similarity_threshold=0.1");
        debug!("{}", debug_query::<Pg, _>(&set_similarity_threshold));
        let _ = set_similarity_threshold.execute(conn).await;

        let query = plants::table
            .select((
                plants::all_columns,
                greatest(
                    similarity(unique_name, search_query),
                    similarity(array_to_string(common_name_de, " "), search_query),
                    similarity(array_to_string(common_name_en, " "), search_query),
                    similarity_nullable(edible_uses_en, search_query),
                )
                .alias("rank"),
            ))
            .filter(
                unique_name
                    .fuzzy(search_query)
                    .or(array_to_string(common_name_de, " ").fuzzy(search_query))
                    .or(array_to_string(common_name_en, " ").fuzzy(search_query))
                    .or(edible_uses_en.fuzzy(search_query)),
            )
            .order(sql::<Float>("rank").desc())
            .paginate(page_parameters.page)
            .per_page(page_parameters.per_page);
        debug!("{}", debug_query::<Pg, _>(&query));
        query
            .load_page::<(Self, f32)>(conn)
            .await
            .map(Page::from_entity)
    }

    /// Get a page of some plants.
    ///
    /// # Errors
    /// * Unknown, diesel doesn't say why it might error.
    pub async fn find_any(
        page_parameters: PageParameters,
        conn: &mut AsyncPgConnection,
    ) -> QueryResult<Page<PlantsSummaryDto>> {
        let query = plants::table
            .select(all_columns)
            .into_boxed()
            .paginate(page_parameters.page)
            .per_page(page_parameters.per_page);
        debug!("{}", debug_query::<Pg, _>(&query));
        query.load_page::<Self>(conn).await.map(Page::from_entity)
    }

    /// Fetch plant by id from the database.
    ///
    /// # Errors
    /// * Unknown, diesel doesn't say why it might error.
    pub async fn find_by_id(
        id: i32,
        conn: &mut AsyncPgConnection,
    ) -> QueryResult<PlantsSummaryDto> {
        let query = plants::table.find(id);
        debug!("{}", debug_query::<Pg, _>(&query));
        query.first::<Self>(conn).await.map(Into::into)
    }
}
