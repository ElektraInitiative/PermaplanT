//! Contains the implementation of [`Layer`].

use diesel::pg::Pg;
use diesel::{debug_query, ExpressionMethods, QueryDsl, QueryResult};
use diesel_async::{AsyncPgConnection, RunQueryDsl};
use log::debug;

use crate::db::pagination::Paginate;
use crate::model::dto::{LayerSearchParameters, Page, PageParameters};
use crate::{
    model::dto::{LayerDto, NewLayerDto},
    schema::layers::{self, all_columns, is_alternative, map_id, type_},
};

use super::{Layer, NewLayer};

impl Layer {
    /// Get a page of layers.
    /// Can be filtered by its active status if one is provided in `search_parameters`.
    ///
    /// # Errors
    /// * Unknown, diesel doesn't say why it might error.
    pub async fn find(
        search_parameters: LayerSearchParameters,
        page_parameters: PageParameters,
        conn: &mut AsyncPgConnection,
    ) -> QueryResult<Page<LayerDto>> {
        let mut query = layers::table.select(all_columns).into_boxed();

        if let Some(map_id_search) = search_parameters.map_id {
            query = query.filter(map_id.eq(map_id_search));
        }
        if let Some(type_search) = search_parameters.type_ {
            query = query.filter(type_.eq(type_search));
        }
        if let Some(is_alternative_search) = search_parameters.is_alternative {
            query = query.filter(is_alternative.eq(is_alternative_search));
        }

        let query = query
            .paginate(page_parameters.page)
            .per_page(page_parameters.per_page);
        debug!("{}", debug_query::<Pg, _>(&query));
        query.load_page::<Self>(conn).await.map(Page::from_entity)
    }

    /// Fetch layer by id from the database.
    ///
    /// # Errors
    /// * Unknown, diesel doesn't say why it might error.
    pub async fn find_by_id(id: i32, conn: &mut AsyncPgConnection) -> QueryResult<LayerDto> {
        let query = layers::table.find(id);
        debug!("{}", debug_query::<Pg, _>(&query));
        query.first::<Self>(conn).await.map(Into::into)
    }

    /// Create a new layer in the database.
    ///
    /// # Errors
    /// * Unknown, diesel doesn't say why it might error.
    pub async fn create(
        new_layer: NewLayerDto,
        conn: &mut AsyncPgConnection,
    ) -> QueryResult<LayerDto> {
        let new_layer = NewLayer::from(new_layer);
        let query = diesel::insert_into(layers::table).values(&new_layer);
        debug!("{}", debug_query::<Pg, _>(&query));
        query.get_result::<Self>(conn).await.map(Into::into)
    }

    /// Delete the layer from the database.
    ///
    /// # Errors
    /// * Unknown, diesel doesn't say why it might error.
    pub async fn delete_by_id(id: i32, conn: &mut AsyncPgConnection) -> QueryResult<usize> {
        let query = diesel::delete(layers::table.find(id));
        debug!("{}", debug_query::<Pg, _>(&query));
        query.execute(conn).await
    }
}
