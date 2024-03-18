//! Contains the implementation of [`Drawings`].

use diesel::pg::Pg;
use diesel::{debug_query, ExpressionMethods, QueryDsl, QueryResult};
use diesel_async::{AsyncConnection, AsyncPgConnection, RunQueryDsl};
use futures_util::Future;
use log::debug;
use uuid::Uuid;

use crate::model::dto::drawings::DrawingDto;
use crate::model::entity::drawings::Drawing;
use crate::schema::{drawings, layers};

impl Drawing {
    /// Get all drawings assosicated with one map.
    ///
    /// # Errors
    /// * Unknown, diesel doesn't say why it might error.
    pub async fn find(map_id: i32, conn: &mut AsyncPgConnection) -> QueryResult<Vec<DrawingDto>> {
        let query = drawings::table
            .left_join(layers::table)
            .filter(layers::map_id.eq(map_id))
            .select(drawings::all_columns)
            .into_boxed();

        Ok(query
            .load::<Self>(conn)
            .await?
            .into_iter()
            .map(Into::into)
            .collect())
    }

    /// Save new drawings into the database.
    ///
    /// # Errors
    /// * If the `layer_id` references a layer that is not of type `plant`.
    /// * Unknown, diesel doesn't say why it might error.
    pub async fn create(
        dto_vec: Vec<DrawingDto>,
        conn: &mut AsyncPgConnection,
    ) -> QueryResult<Vec<DrawingDto>> {
        let new_drawings: Vec<Self> = dto_vec.into_iter().map(Into::into).collect();
        let query = diesel::insert_into(drawings::table).values(&new_drawings);

        debug!("{}", debug_query::<Pg, _>(&query));

        let result = query
            .get_results::<Self>(conn)
            .await?
            .into_iter()
            .map(Into::into)
            .collect::<Vec<DrawingDto>>();

        Ok(result)
    }

    /// Replace existing drawings in the database.
    ///
    /// # Errors
    /// * Unknown, diesel doesn't say why it might error.
    pub async fn update(
        dto_vec: Vec<DrawingDto>,
        conn: &mut AsyncPgConnection,
    ) -> QueryResult<Vec<DrawingDto>> {
        let drawing_updates = dto_vec.into_iter().map(Into::into).collect();

        let result = conn
            .transaction(|transaction| {
                Box::pin(async {
                    let futures = Self::do_update(drawing_updates, transaction);

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
        updates: Vec<Self>,
        conn: &mut AsyncPgConnection,
    ) -> Vec<impl Future<Output = QueryResult<Self>>> {
        let mut futures = Vec::with_capacity(updates.len());

        for update in updates {
            let updated_drawings = diesel::update(drawings::table.find(update.id))
                .set(update)
                .get_result::<Self>(conn);

            futures.push(updated_drawings);
        }

        futures
    }

    /// Delete the drawings from the database.
    ///
    /// # Errors
    /// * Unknown, diesel doesn't say why it might error.
    pub async fn delete_by_ids(ids: Vec<Uuid>, conn: &mut AsyncPgConnection) -> QueryResult<usize> {
        let query = diesel::delete(drawings::table.filter(drawings::id.eq_any(ids)));
        debug!("{}", debug_query::<Pg, _>(&query));
        query.execute(conn).await
    }
}
