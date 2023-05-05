//! Contains the implementation of [`MapVersion`].

use diesel::{ExpressionMethods, QueryDsl, QueryResult};
use diesel_async::{AsyncPgConnection, RunQueryDsl};

use crate::db::pagination::Paginate;
use crate::model::dto::{MapVersionSearchParameters, Page, PageParameters};
use crate::{
    model::dto::{MapVersionDto, NewMapVersionDto},
    schema::map_versions::{self, all_columns, map_id},
};

use super::{MapVersion, NewMapVersion};

impl MapVersion {
    /// Get a page of map versions.
    /// Can be filtered by its parent map if one is provided in `search_parameters`.
    ///
    /// # Errors
    /// * Unknown, diesel doesn't say why it might error.
    pub async fn find(
        search_parameters: MapVersionSearchParameters,
        page_parameters: PageParameters,
        conn: &mut AsyncPgConnection,
    ) -> QueryResult<Page<MapVersionDto>> {
        let mut query = map_versions::table.select(all_columns).into_boxed();

        if let Some(map_id_search) = search_parameters.map_id {
            query = query.filter(map_id.eq(map_id_search));
        }

        let query_page = query
            .paginate(page_parameters.page)
            .per_page(page_parameters.per_page)
            .load_page::<Self>(conn)
            .await;
        query_page.map(Page::from_entity)
    }

    /// Fetch map version by id from the database.
    ///
    /// # Errors
    /// * Unknown, diesel doesn't say why it might error.
    pub async fn find_by_id(id: i32, conn: &mut AsyncPgConnection) -> QueryResult<MapVersionDto> {
        let query_result = map_versions::table.find(id).first::<Self>(conn).await;
        query_result.map(Into::into)
    }

    /// Create a new map version in the database.
    ///
    /// # Errors
    /// * Unknown, diesel doesn't say why it might error.
    pub async fn create(
        new_map_version: NewMapVersionDto,
        conn: &mut AsyncPgConnection,
    ) -> QueryResult<MapVersionDto> {
        let new_map_version = NewMapVersion::from(new_map_version);
        let query_result = diesel::insert_into(map_versions::table)
            .values(&new_map_version)
            .get_result::<Self>(conn)
            .await;
        query_result.map(Into::into)
    }
}
