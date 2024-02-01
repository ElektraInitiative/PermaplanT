//! Contains the implementation of [`Planting`].

use chrono::{NaiveDate, Utc};
use diesel::pg::Pg;
use diesel::{
    debug_query, BoolExpressionMethods, ExpressionMethods, NullableExpressionMethods, QueryDsl,
    QueryResult,
};
use diesel_async::{AsyncConnection, AsyncPgConnection, RunQueryDsl};
use futures_util::Future;
use log::debug;
use uuid::Uuid;

use super::plantings::UpdatePlanting;
use super::Map;
use crate::model::dto::plantings::{DeletePlantingDto, MapPlantingDto, UpdatePlantingDto};
use crate::model::entity::plantings::{NewPlanting, Planting};
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
    ) -> QueryResult<Vec<MapPlantingDto>> {
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

    /// Get all plantings that have a specific seed id.
    ///
    /// # Errors
    /// * Unknown, diesel doesn't say why it might error.
    pub async fn find_by_seed_id(
        seed_id: i32,
        conn: &mut AsyncPgConnection,
    ) -> QueryResult<Vec<MapPlantingDto>> {
        let query = plantings::table
            .select(plantings::all_columns)
            .filter(plantings::seed_id.eq(seed_id));

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
        dto_vec: Vec<MapPlantingDto>,
        map_id: i32,
        user_id: Uuid,
        conn: &mut AsyncPgConnection,
    ) -> QueryResult<Vec<MapPlantingDto>> {
        let planting_creations: Vec<NewPlanting> = dto_vec
            .into_iter()
            .map(|dto| NewPlanting::from((dto, user_id)))
            .collect();
        let query = diesel::insert_into(plantings::table).values(&planting_creations);

        debug!("{}", debug_query::<Pg, _>(&query));

        let query_result = query.get_results::<Self>(conn).await?;

        let seed_ids = query_result
            .iter()
            .map(|planting| planting.seed_id)
            .collect::<Vec<_>>();

        // There seems to be no way of retrieving the additional name using the insert query
        // above.
        let additional_names_query = seeds::table
            .filter(seeds::id.nullable().eq_any(&seed_ids))
            .select((seeds::id, seeds::name));

        debug!("{}", debug_query::<Pg, _>(&additional_names_query));

        let seed_ids_names: Vec<(i32, String)> = additional_names_query.get_results(conn).await?;

        let seed_ids_to_names = seed_ids_names
            .into_iter()
            .collect::<std::collections::HashMap<_, _>>();

        let result_vec = query_result
            .into_iter()
            .map(MapPlantingDto::from)
            .map(|mut dto| {
                if let Some(seed_id) = dto.seed_id {
                    dto.additional_name = seed_ids_to_names.get(&seed_id).cloned();
                }
                dto
            })
            .collect::<Vec<_>>();

        if let Some(first) = result_vec.get(0) {
            Map::update_modified_metadata(map_id, user_id, first.created_at, conn).await?;
        }

        Ok(result_vec)
    }

    /// Partially update a planting in the database.
    ///
    /// # Errors
    /// * Unknown, diesel doesn't say why it might error.
    pub async fn update(
        dto: UpdatePlantingDto,
        map_id: i32,
        user_id: Uuid,
        conn: &mut AsyncPgConnection,
    ) -> QueryResult<Vec<MapPlantingDto>> {
        let planting_updates = Vec::from(dto);

        let result = conn
            .transaction(|transaction| {
                Box::pin(async {
                    let futures = Self::do_update(planting_updates, user_id, transaction);

                    let results = futures_util::future::try_join_all(futures).await?;

                    if let Some(first) = results.get(0) {
                        Map::update_modified_metadata(
                            map_id,
                            user_id,
                            first.modified_at,
                            transaction,
                        )
                        .await?;
                    }

                    Ok(results) as QueryResult<Vec<Self>>
                })
            })
            .await?;

        Ok(result.into_iter().map(Into::into).collect())
    }

    /// Performs the actual update of the plantings using pipelined requests.
    /// See [`diesel_async::AsyncPgConnection`] for more information.
    /// Because the type system can not easily infer the type of futures
    /// this helper function is needed, with explicit type annotations.
    fn do_update(
        updates: Vec<UpdatePlanting>,
        user_id: Uuid,
        conn: &mut AsyncPgConnection,
    ) -> Vec<impl Future<Output = QueryResult<Self>>> {
        let mut futures = Vec::with_capacity(updates.len());
        let now = Utc::now().naive_utc();

        for update in updates {
            let updated_planting = diesel::update(plantings::table.find(update.id))
                .set((
                    update,
                    plantings::modified_at.eq(now),
                    plantings::modified_by.eq(user_id),
                ))
                .get_result::<Self>(conn);

            futures.push(updated_planting);
        }

        futures
    }

    /// Delete the plantings from the database.
    ///
    /// # Errors
    /// * Unknown, diesel doesn't say why it might error.
    pub async fn delete_by_ids(
        dto: Vec<DeletePlantingDto>,
        map_id: i32,
        user_id: Uuid,
        conn: &mut AsyncPgConnection,
    ) -> QueryResult<usize> {
        let ids: Vec<Uuid> = dto.iter().map(|&DeletePlantingDto { id }| id).collect();

        conn.transaction(|transaction| {
            Box::pin(async {
                let query = diesel::delete(plantings::table.filter(plantings::id.eq_any(ids)));
                debug!("{}", debug_query::<Pg, _>(&query));
                let deleted_plantings = query.execute(transaction).await?;

                Map::update_modified_metadata(map_id, user_id, Utc::now().naive_utc(), transaction)
                    .await?;
                Ok(deleted_plantings)
            })
        })
        .await
    }
}
