//! Contains the implementation of [`Planting`].

use chrono::NaiveDate;
use diesel::pg::Pg;
use diesel::{
    debug_query, BoolExpressionMethods, ExpressionMethods, NullableExpressionMethods, QueryDsl,
    QueryResult,
};
use diesel_async::{AsyncPgConnection, RunQueryDsl};
use log::debug;
use uuid::Uuid;

use crate::model::dto::plantings::{NewPlantingDto, PlantingDto, UpdatePlantingDto};
use crate::model::entity::plantings::{Planting, UpdatePlanting};
use crate::schema::plantings::{self, layer_id, plant_id};
use crate::schema::seeds;

/// Arguments for the database layer find plantings function.
pub struct FindPlantingsParameters {
    /// The id of the plant to find plantings for.
    pub plant_id: Option<i32>,
    /// The id of the layer to find plantings for.
    pub layer_id: Option<i32>,
    /// First date in the time frame plantings are searched for.
    pub from: NaiveDate,
    /// Last date in the time frame plantings are searched for.
    pub to: NaiveDate,
}

impl Planting {
    /// Get all plantings associated with the query.
    ///
    /// # Errors
    /// * Unknown, diesel doesn't say why it might error.
    pub async fn find(
        search_parameters: FindPlantingsParameters,
        conn: &mut AsyncPgConnection,
    ) -> QueryResult<Vec<PlantingDto>> {
        let mut query = plantings::table
            .left_join(seeds::table)
            .select((plantings::all_columns, seeds::name.nullable()))
            .into_boxed();

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
            .load::<(Self, Option<String>)>(conn)
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
        let query_result = query.get_result::<Self>(conn).await.map(Into::into);

        debug!("{}", debug_query::<Pg, _>(&query));

        if planting.seed_id.is_none() || matches!(query_result, Err(_)) {
            return query_result;
        }

        // There seems to be no way of retrieving the additional name using the insert query
        // above.
        if let Some(seed_id) = planting.seed_id {
            if let Ok(mut query_result) = query_result {
                let additional_name_query = seeds::table
                    .select(seeds::name.nullable())
                    .filter(seeds::id.eq(seed_id));

                debug!("{}", debug_query::<Pg, _>(&additional_name_query));

                match additional_name_query
                    .get_result::<Option<String>>(conn)
                    .await
                    .map(Into::into)
                {
                    Ok(additional_name) => query_result.additional_name = additional_name,
                    Err(e) => return Err(e),
                }
                return Ok(query_result);
            }
        }

        Err(::diesel::result::Error::NotFound)
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
