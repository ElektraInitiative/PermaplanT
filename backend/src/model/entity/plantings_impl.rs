//! Contains the implementation of [`Planting`].

use diesel::pg::Pg;
use diesel::{debug_query, ExpressionMethods, QueryDsl, QueryResult};
use diesel_async::{AsyncPgConnection, RunQueryDsl};
use log::debug;
use uuid::Uuid;

use crate::model::dto::plantings::{
    NewPlantingDto, PlantingDto, PlantingSearchParameters, UpdatePlantingDto,
};
use crate::model::entity::plantings::{Planting, UpdatePlanting};
use crate::schema::plantings::{self, all_columns, layer_id, plant_id};

impl Planting {
    /// Get all plantings associated with the query.
    ///
    /// # Errors
    /// * Unknown, diesel doesn't say why it might error.
    pub async fn find(
        search_parameters: PlantingSearchParameters,
        conn: &mut AsyncPgConnection,
    ) -> QueryResult<Vec<PlantingDto>> {
        let mut query = plantings::table.select(all_columns).into_boxed();

        if let Some(id) = search_parameters.plant_id {
            query = query.filter(plant_id.eq(id));
        }
        if let Some(id) = search_parameters.plants_layer_id {
            query = query.filter(layer_id.eq(id));
        }

        debug!("{}", debug_query::<Pg, _>(&query));
        Ok(query
            .load::<Self>(conn)
            .await?
            .into_iter()
            .map(Into::into)
            .collect())
    }

    /// Create a new planting in the database.
    ///
    /// # Errors
    /// * If the `layer_id` references a layer that is not of type `plant`.
    /// * Unknown, diesel doesn't say why it might error.
    pub async fn create(
        dto: NewPlantingDto,
        conn: &mut AsyncPgConnection,
    ) -> QueryResult<PlantingDto> {
        let new_layer = Planting::from(dto);
        let query = diesel::insert_into(plantings::table).values(&new_layer);
        debug!("{}", debug_query::<Pg, _>(&query));
        query.get_result::<Self>(conn).await.map(Into::into)
    }

    /// Partially update a planting in the database.
    ///
    /// # Errors
    /// * Unknown, diesel doesn't say why it might error.
    pub async fn update(
        planting_id: Uuid,
        dto: UpdatePlantingDto,
        conn: &mut AsyncPgConnection,
    ) -> QueryResult<PlantingDto> {
        let new_layer = UpdatePlanting::from(dto);
        let query = diesel::update(plantings::table.find(planting_id)).set(&new_layer);
        debug!("{}", debug_query::<Pg, _>(&query));
        query.get_result::<Self>(conn).await.map(Into::into)
    }

    /// Delete the planting from the database.
    ///
    /// # Errors
    /// * Unknown, diesel doesn't say why it might error.
    pub async fn delete_by_id(id: Uuid, conn: &mut AsyncPgConnection) -> QueryResult<usize> {
        let query = diesel::delete(plantings::table.find(id));
        debug!("{}", debug_query::<Pg, _>(&query));
        query.execute(conn).await
    }
}
