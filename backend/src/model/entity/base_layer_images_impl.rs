//! Contains the implementation of [`Planting`].

use diesel::pg::Pg;
use diesel::{debug_query, QueryDsl, QueryResult};
use diesel_async::{AsyncPgConnection, RunQueryDsl};
use log::debug;
use uuid::Uuid;

use crate::model::dto::{BaseLayerImageDto, UpdateBaseLayerImageDto};
use crate::schema::base_layer_images::{self, all_columns, layer_id};

use super::BaseLayerImages;

impl BaseLayerImages {
    /// Get all plantings associated with the query.
    ///
    /// # Errors
    /// * Unknown, diesel doesn't say why it might error.
    pub async fn find(
        conn: &mut AsyncPgConnection,
        layer_id_param: i32,
    ) -> QueryResult<Vec<BaseLayerImageDto>> {
        let query = base_layer_images::table.select(all_columns);
        //TODO: filter for correct layer_id
        // .filter(layer_id.eq(layer_id_param));

        debug!("{}", debug_query::<Pg, _>(&query));
        Ok(query
            .load::<Self>(conn)
            .await?
            .into_iter()
            .map(Into::into)
            .collect())
    }

    /// Create a new  BaseLayerImage in the database.
    ///
    /// # Errors
    /// * If the `layer_id` references a layer that is not of type `base`.
    /// * Unknown, diesel doesn't say why it might error.
    pub async fn create(
        dto: BaseLayerImageDto,
        conn: &mut AsyncPgConnection,
    ) -> QueryResult<BaseLayerImageDto> {
        let insert = Self::from(dto);
        let query = diesel::insert_into(base_layer_images::table).values(&insert);
        debug!("{}", debug_query::<Pg, _>(&query));
        query.get_result::<Self>(conn).await.map(Into::into)
    }

    /// Update a BaseLayerImage in the database.
    ///
    /// # Errors
    /// * Unknown, diesel doesn't say why it might error.
    pub async fn update(
        id: Uuid,
        dto: UpdateBaseLayerImageDto,
        conn: &mut AsyncPgConnection,
    ) -> QueryResult<BaseLayerImageDto> {
        let update = Self::from((id, dto));
        let query = diesel::update(base_layer_images::table.find(id)).set(&update);
        debug!("{}", debug_query::<Pg, _>(&query));
        query.get_result::<Self>(conn).await.map(Into::into)
    }

    /// Delete the BaseLayerImage from the database.
    ///
    /// # Errors
    /// * Unknown, diesel doesn't say why it might error.
    pub async fn delete_by_id(id: Uuid, conn: &mut AsyncPgConnection) -> QueryResult<usize> {
        let query = diesel::delete(base_layer_images::table.find(id));
        debug!("{}", debug_query::<Pg, _>(&query));
        query.execute(conn).await
    }
}
