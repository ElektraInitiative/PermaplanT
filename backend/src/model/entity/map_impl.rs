//! Contains the implementation of [`Map`].

use diesel::{ExpressionMethods, QueryDsl, QueryResult};
use diesel_async::{AsyncPgConnection, RunQueryDsl};

use crate::db::pagination::Paginate;
use crate::model::dto::{MapSearchParameters, Page, PageParameters};
use crate::{
    model::dto::{MapDto, NewMapDto},
    schema::maps::{self, all_columns, is_inactive},
};

use super::{Map, NewMap};

impl Map {
    /// Get a page of maps.
    /// Can be filtered by its active status if one is provided in `search_parameters`.
    ///
    /// # Errors
    /// * Unknown, diesel doesn't say why it might error.
    pub async fn find(
        search_parameters: MapSearchParameters,
        page_parameters: PageParameters,
        conn: &mut AsyncPgConnection,
    ) -> QueryResult<Page<MapDto>> {
        let mut query = maps::table.select(all_columns).into_boxed();

        if let Some(is_inactive_search) = search_parameters.is_inactive {
            query = query.filter(is_inactive.eq(is_inactive_search));
        }

        let query_page = query
            .paginate(page_parameters.page)
            .per_page(page_parameters.per_page)
            .load_page::<Self>(conn)
            .await;
        query_page.map(Page::from_entity)
    }

    /// Fetch map by id from the database.
    ///
    /// # Errors
    /// * Unknown, diesel doesn't say why it might error.
    pub async fn find_by_id(id: i32, conn: &mut AsyncPgConnection) -> QueryResult<MapDto> {
        let query_result = maps::table.find(id).first::<Self>(conn).await;
        query_result.map(Into::into)
    }

    /// Create a new map in the database.
    ///
    /// # Errors
    /// * Unknown, diesel doesn't say why it might error.
    pub async fn create(new_map: NewMapDto, conn: &mut AsyncPgConnection) -> QueryResult<MapDto> {
        let new_map = NewMap::from(new_map);
        let query_result = diesel::insert_into(maps::table)
            .values(&new_map)
            .get_result::<Self>(conn)
            .await;
        query_result.map(Into::into)
    }
}
