//! Contains the implementation of [`Shading`].

use chrono::NaiveDate;
use diesel::pg::Pg;
use diesel::{debug_query, BoolExpressionMethods, ExpressionMethods, QueryDsl, QueryResult};
use diesel_async::{AsyncConnection, AsyncPgConnection, RunQueryDsl};
use log::debug;
use std::future::Future;
use uuid::Uuid;

use crate::model::dto::shadings::{DeleteShadingDto, NewShadingDto, ShadingDto, UpdateShadingDto};
use crate::model::entity::shadings::{Shading, UpdateShading};
use crate::schema::shadings::{self, all_columns, layer_id};

/// Arguments for the database layer find shadings function.
pub struct FindShadingsParameters {
    /// The id of the layer to find shadings for.
    pub layer_id: Option<i32>,
    /// First date in the time frame shadings are searched for.
    pub from: NaiveDate,
    /// Last date in the time frame shadings are searched for.
    pub to: NaiveDate,
}

impl Shading {
    /// Get all shadings associated with the query.
    ///
    /// # Errors
    /// * Unknown, diesel doesn't say why it might error.
    pub async fn find(
        search_parameters: FindShadingsParameters,
        conn: &mut AsyncPgConnection,
    ) -> QueryResult<Vec<ShadingDto>> {
        let mut query = shadings::table.select(all_columns).into_boxed();

        if let Some(id) = search_parameters.layer_id {
            query = query.filter(layer_id.eq(id));
        }

        let shadings_added_before_date = shadings::add_date
            .is_null()
            .or(shadings::add_date.lt(search_parameters.to));
        let shadings_removed_after_date = shadings::remove_date
            .is_null()
            .or(shadings::remove_date.gt(search_parameters.from));

        query = query.filter(shadings_added_before_date.and(shadings_removed_after_date));

        debug!("{}", debug_query::<Pg, _>(&query));

        Ok(query
            .load::<Self>(conn)
            .await?
            .into_iter()
            .map(Into::into)
            .collect())
    }

    /// Create a new shading in the database.
    ///
    /// # Errors
    /// * If the `layer_id` references a layer that is not of type `plant`.
    /// * Unknown, diesel doesn't say why it might error.
    pub async fn create(
        dto_vec: Vec<NewShadingDto>,
        conn: &mut AsyncPgConnection,
    ) -> QueryResult<Vec<ShadingDto>> {
        let new_shadings: Vec<Self> = dto_vec.into_iter().map(Into::into).collect();
        let query = diesel::insert_into(shadings::table).values(&new_shadings);

        debug!("{}", debug_query::<Pg, _>(&query));

        let result = query
            .get_results::<Self>(conn)
            .await?
            .into_iter()
            .map(Into::into)
            .collect::<Vec<ShadingDto>>();

        Ok(result)
    }

    /// Partially update a shading in the database.
    ///
    /// # Errors
    /// * Unknown, diesel doesn't say why it might error.
    pub async fn update(
        dto: UpdateShadingDto,
        conn: &mut AsyncPgConnection,
    ) -> QueryResult<Vec<ShadingDto>> {
        let shading_updates = Vec::from(dto);

        let result = conn
            .transaction(|transaction| {
                Box::pin(async {
                    let futures = Self::do_update(shading_updates, transaction);

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
        updates: Vec<UpdateShading>,
        conn: &mut AsyncPgConnection,
    ) -> Vec<impl Future<Output = QueryResult<Self>>> {
        let mut futures = Vec::with_capacity(updates.len());

        for update in updates {
            let updated_shadings = diesel::update(shadings::table.find(update.id))
                .set(update)
                .get_result::<Self>(conn);

            futures.push(updated_shadings);
        }

        futures
    }

    /// Delete the shading from the database.
    ///
    /// # Errors
    /// * Unknown, diesel doesn't say why it might error.
    pub async fn delete_by_ids(
        dtos: Vec<DeleteShadingDto>,
        conn: &mut AsyncPgConnection,
    ) -> QueryResult<usize> {
        let ids: Vec<Uuid> = dtos.iter().map(|&DeleteShadingDto { id }| id).collect();

        let query = diesel::delete(shadings::table.filter(shadings::id.eq_any(ids)));
        debug!("{}", debug_query::<Pg, _>(&query));
        query.execute(conn).await
    }
}
