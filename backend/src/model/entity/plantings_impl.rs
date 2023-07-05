//! Contains the implementation of [`Planting`].

use diesel::pg::Pg;
use diesel::{debug_query, BoolExpressionMethods, ExpressionMethods, QueryDsl, QueryResult};
use diesel_async::{AsyncPgConnection, RunQueryDsl};
use log::debug;
use uuid::Uuid;

use crate::model::dto::plantings::{NewPlantingDto, PlantingDto, UpdatePlantingDto};
use crate::model::entity::plantings::{Planting, UpdatePlanting};
use crate::schema::plantings::{self, all_columns, layer_id, plant_id};

use super::plantings::FindPlantingsParameters;

impl Planting {
    /// Get all plantings associated with the query.
    ///
    /// # Errors
    /// * Unknown, diesel doesn't say why it might error.
    pub async fn find(
        search_parameters: FindPlantingsParameters,
        conn: &mut AsyncPgConnection,
    ) -> QueryResult<Vec<PlantingDto>> {
        let mut query = plantings::table.select(all_columns).into_boxed();

        if let Some(id) = search_parameters.plant_id {
            query = query.filter(plant_id.eq(id));
        }
        if let Some(id) = search_parameters.layer_id {
            query = query.filter(layer_id.eq(id));
        }

        let from = search_parameters.from;
        let to = search_parameters.to;

        let plantings_added_before_date =
            plantings::add_date.is_null().or(plantings::add_date.lt(to));
        let plantings_removed_after_date = plantings::remove_date
            .is_null()
            .or(plantings::remove_date.gt(from));

        query = query.filter(plantings_added_before_date.and(plantings_removed_after_date));

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
        let planting = Self::from(dto);
        let query = diesel::insert_into(plantings::table).values(&planting);
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
        let planting = UpdatePlanting::from(dto);
        let query = diesel::update(plantings::table.find(planting_id)).set(&planting);
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
