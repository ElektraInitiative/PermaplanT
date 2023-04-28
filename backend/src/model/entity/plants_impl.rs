//! Contains the implementation of [`Plants`].

use diesel::{BoolExpressionMethods, PgTextExpressionMethods, QueryDsl, QueryResult};
use diesel_async::{AsyncPgConnection, RunQueryDsl};

use crate::db::function::array_to_string;
use crate::db::pagination::Paginate;
use crate::model::dto::{Page, PageParameters, PlantsSearchParameters};
use crate::{
    model::dto::PlantsSummaryDto,
    schema::plants::{self, all_columns, common_name_en, unique_name},
};

use super::Plants;

impl Plants {
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
