//! Contains the implementation of [`Layer`].

use diesel::pg::Pg;
use diesel::{debug_query, ExpressionMethods, QueryDsl, QueryResult};
use diesel_async::{AsyncPgConnection, RunQueryDsl};
use log::debug;

use crate::config::data::AppDataInner;
use crate::model::dto::layers::{LayerRenameDto, LayerSearchParameters};
use crate::model::entity::layers::{Layer, NewLayer};
use crate::model::entity::maps::maps;
use crate::{
    model::dto::layers::{LayerDto, NewLayerDto},
    schema::layers::{self, all_columns, is_alternative, map_id, type_},
};

use super::layers::UpdateLayerOrderIndex;

impl Layer {
    /// Get a page of layers.
    /// Can be filtered by its active status if one is provided in `search_parameters`.
    ///
    /// # Errors
    /// * Unknown, diesel doesn't say why it might error.
    pub async fn find(
        search_parameters: LayerSearchParameters,
        conn: &mut AsyncPgConnection,
    ) -> QueryResult<Vec<LayerDto>> {
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

        debug!("{}", debug_query::<Pg, _>(&query));
        Ok(query
            .load::<Self>(conn)
            .await?
            .into_iter()
            .map(Into::into)
            .collect())
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
        map_id: i32,
        new_layer: NewLayerDto,
        conn: &mut AsyncPgConnection,
    ) -> QueryResult<LayerDto> {
        let new_layer = NewLayer::from((map_id, new_layer));
        let query = diesel::insert_into(layers::table).values(&new_layer);
        debug!("{}", debug_query::<Pg, _>(&query));
        query.get_result::<Self>(conn).await.map(Into::into)
    }

    pub async fn reorder(
        map_id: i32,
        new_order: Vec<i32>,
        conn: &mut AsyncPgConnection,
    ) -> QueryResult<()> {
        // let count = layers::table
        //     .filter(map_id.eq(map_id))
        //     .filter(layers::id.eq_any(new_order))
        //     .select(count_star())
        //     .first::<i64>(conn)
        //     .await?;
        // if (count != )
        // Ok(count as usize == layer_ids.len())
        let order_update = new_order
            .into_iter()
            .enumerate()
            .map(|(index, id)| UpdateLayerOrderIndex {
                id,
                order_index: index,
            })
            .collect();
        let query = diesel::update(layers::table).set(&order_update);
        debug!("{}", debug_query::<Pg, _>(&query));
        query.get_result::<Self>(conn).await?.map(Into::into);
        Ok(())
    }

    pub async fn rename(dto: LayerRenameDto, conn: &mut AsyncPgConnection) -> QueryResult<()> {
        let update: UpdateLayerOrderIndex = dto.into();
        let query = diesel::update(layers::table).set(&update);
        debug!("{}", debug_query::<Pg, _>(&query));
        query.execute(conn).await?;
        Ok(())
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
