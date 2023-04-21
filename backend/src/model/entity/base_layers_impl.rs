//! Contains the implementation of [`BaseLayer`]
use diesel::{QueryResult, QueryDsl};
use diesel_async::{AsyncPgConnection, RunQueryDsl};
use crate::{
    model::dto::{BaseLayerDto, NewBaseLayerDto},
    schema::base_layers::{self},
};

use super::{BaseLayer, NewBaseLayer};

impl BaseLayer {
    /// Fetch base layer by id from the database.
    ///
    /// # Errors
    /// * Unknown, diesel doesn't say why it might error.
    pub async fn find_by_id(
        id: i32,
        conn: &mut AsyncPgConnection,
    ) -> QueryResult<BaseLayerDto> {
        let query_result = base_layers::table.find(id).first::<Self>(conn).await;
        query_result.map(Into::into)
    } 

    /// Create a new base layer in the database.
    ///
    /// # Errors
    /// * Unknown, diesel doesn't say why it might error.
    pub async fn create(
        new_base_layer: NewBaseLayerDto,
        conn: &mut AsyncPgConnection,
    ) -> QueryResult<BaseLayerDto> {
        let new_seed = NewBaseLayer::from(new_base_layer);
        let query_result = diesel::insert_into(base_layers::table)
            .values(&new_seed)
            .get_result::<Self>(conn)
            .await;
        query_result.map(Into::into)
    }

    /// Delete the seed from the database.
    ///
    /// # Errors
    /// * Unknown, diesel doesn't say why it might error.
    pub async fn delete_by_id(id: i32, conn: &mut AsyncPgConnection) -> QueryResult<usize> {
        diesel::delete(base_layers::table.find(id)).execute(conn).await
    }
}