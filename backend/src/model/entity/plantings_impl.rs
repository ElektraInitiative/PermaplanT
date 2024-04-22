//! Contains the implementation of [`Planting`].

use chrono::{Duration, NaiveDate};
use diesel::pg::Pg;
use diesel::{
    debug_query, BoolExpressionMethods, ExpressionMethods, NullableExpressionMethods, QueryDsl,
    QueryResult,
};
use diesel_async::{AsyncConnection, AsyncPgConnection, RunQueryDsl};
use futures_util::Future;
use log::debug;
use uuid::Uuid;

use crate::model::dto::plantings::{
    DeletePlantingDto, NewPlantingDto, PlantingDto, UpdatePlantingDto,
};
use crate::model::entity::plantings::Planting;
use crate::model::r#enum::life_cycle::LifeCycle;
use crate::schema::plantings::{self, layer_id, plant_id};
use crate::schema::plants;
use crate::schema::seeds;

use super::plantings::UpdatePlanting;

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

    /// Get all plantings that have a specific seed id.
    ///
    /// # Errors
    /// * Unknown, diesel doesn't say why it might error.
    pub async fn find_by_seed_id(
        seed_id: i32,
        conn: &mut AsyncPgConnection,
    ) -> QueryResult<Vec<PlantingDto>> {
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

    /// Helper that sets `end_date` according to the `life_cycle`.
    async fn set_end_date_according_to_cycle_types(
        conn: &mut AsyncPgConnection,
        plantings: &mut Vec<Self>,
    ) -> QueryResult<()> {
        /// life cycles are currently persisted as an optional list of optional values.
        type LifeCycleType = Option<Vec<Option<LifeCycle>>>;

        let plant_ids: Vec<i32> = plantings.iter().map(|p| p.plant_id).collect();
        let life_cycles_query = plants::table
            .filter(plants::id.eq_any(&plant_ids))
            .select((plants::id, plants::life_cycle.nullable()));

        let life_cycle_lookup = life_cycles_query.load::<(i32, LifeCycleType)>(conn).await?;

        for planting in plantings {
            if let Some(add_date) = planting.add_date {
                let current_plant_id = planting.plant_id;
                let life_cycle_info_opt: Option<(i32, LifeCycleType)> = life_cycle_lookup
                    .iter()
                    .find_map(|x| (x.0 == current_plant_id).then(|| x.clone()));
                if let Some((_, Some(life_cycles))) = life_cycle_info_opt {
                    if life_cycles.contains(&Some(LifeCycle::Perennial)) {
                        continue;
                    } else if life_cycles.contains(&Some(LifeCycle::Biennial)) {
                        planting.remove_date = Some(add_date + Duration::days(2 * 365));
                    } else if life_cycles.contains(&Some(LifeCycle::Annual)) {
                        planting.remove_date = Some(add_date + Duration::days(365));
                    }
                };
            };
        }
        Ok(())
    }

    /// Create a new planting in the database.
    ///
    /// # Errors
    /// * If the `layer_id` references a layer that is not of type `plant`.
    /// * Unknown, diesel doesn't say why it might error.
    pub async fn create(
        dto_vec: Vec<NewPlantingDto>,
        conn: &mut AsyncPgConnection,
    ) -> QueryResult<Vec<PlantingDto>> {
        let mut planting_creations: Vec<Self> = dto_vec.into_iter().map(Into::into).collect();

        Self::set_end_date_according_to_cycle_types(conn, &mut planting_creations).await?;

        let query = diesel::insert_into(plantings::table).values(&planting_creations);

        debug!("{}", debug_query::<Pg, _>(&query));

        let query_result: Vec<Self> = query.get_results(conn).await?;

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
            .map(PlantingDto::from)
            .map(|mut dto| {
                if let Some(seed_id) = dto.seed_id {
                    dto.additional_name = seed_ids_to_names.get(&seed_id).cloned();
                }
                dto
            })
            .collect::<Vec<_>>();

        Ok(result_vec)
    }

    /// Partially update a planting in the database.
    ///
    /// # Errors
    /// * Unknown, diesel doesn't say why it might error.
    pub async fn update(
        dto: UpdatePlantingDto,
        conn: &mut AsyncPgConnection,
    ) -> QueryResult<Vec<PlantingDto>> {
        let planting_updates = Vec::from(dto);

        let result = conn
            .transaction(|transaction| {
                Box::pin(async {
                    let futures = Self::do_update(planting_updates, transaction);

                    let results = futures_util::future::try_join_all(futures).await?;

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
        conn: &mut AsyncPgConnection,
    ) -> Vec<impl Future<Output = QueryResult<Self>>> {
        let mut futures = Vec::with_capacity(updates.len());

        for update in updates {
            let updated_planting = diesel::update(plantings::table.find(update.id))
                .set(update)
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
        conn: &mut AsyncPgConnection,
    ) -> QueryResult<usize> {
        let ids: Vec<Uuid> = dto.iter().map(|&DeletePlantingDto { id }| id).collect();

        let query = diesel::delete(plantings::table.filter(plantings::id.eq_any(ids)));
        debug!("{}", debug_query::<Pg, _>(&query));
        query.execute(conn).await
    }
}
