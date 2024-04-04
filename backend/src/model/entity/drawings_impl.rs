//! Contains the implementation of [`Drawing`].

use diesel::pg::Pg;
use diesel::query_dsl::methods::FilterDsl;
use diesel::{debug_query, ExpressionMethods, JoinOnDsl, QueryDsl, QueryResult};
use diesel_async::{AsyncConnection, AsyncPgConnection, RunQueryDsl};
use futures_util::Future;
use log::debug;
use uuid::Uuid;

use crate::model::dto::drawings::{DrawingDto, UpdateDrawingsDto};
use crate::model::entity::drawings::Drawing;
use crate::schema::{
    drawings, ellipse_drawings, freeline_drawings, image_drawings, labeltext_drawings, layers,
    polygon_drawings, rectangle_drawings,
};

use super::drawings::{DrawingJoined, UpdateDrawing};

impl Drawing {
    /// Get all drawings assosicated with one map.
    ///
    /// # Errors
    /// * Unknown, diesel doesn't say why it might error.
    pub async fn find(map_id: i32, conn: &mut AsyncPgConnection) -> QueryResult<Vec<DrawingDto>> {
        let query = drawings::table
            .left_join(
                rectangle_drawings::table.on(drawings::properties_id.eq(rectangle_drawings::id)),
            )
            .left_join(ellipse_drawings::table.on(drawings::properties_id.eq(ellipse_drawings::id)))
            .left_join(
                freeline_drawings::table.on(drawings::properties_id.eq(freeline_drawings::id)),
            )
            .left_join(polygon_drawings::table.on(drawings::properties_id.eq(polygon_drawings::id)))
            .left_join(
                labeltext_drawings::table.on(drawings::properties_id.eq(labeltext_drawings::id)),
            )
            .left_join(image_drawings::table.on(drawings::properties_id.eq(image_drawings::id)))
            .select((
                drawings::all_columns,
                rectangle_drawings::all_columns.nullable(),
                ellipse_drawings::all_columns.nullable(),
                freeline_drawings::all_columns.nullable(),
                polygon_drawings::all_columns.nullable(),
                labeltext_drawings::all_columns.nullable(),
                image_drawings::all_columns.nullable(),
            ));

        let results: Vec<DrawingJoined> = query.load::<DrawingJoined>(conn).await?;
        results.into_iter()
            .map(|drawings_joined| {

            if let Some(rect) = drawings_joined.rectangle_drawing {
                DrawingProperties::Rectangle(rect)
            } else if let Some(ell) = ellipse {
                DrawingProperties::Ellipse(ell)
            } else {
                // Handle other property types here
                // For simplicity, we're assuming all drawings have either rectangle or ellipse properties
                panic!("Unexpected combination of drawing and properties")
            };
        ).collect()
    }

    /// Save new drawings into the database.
    ///
    /// # Errors
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
        dto_vec: UpdateDrawingsDto,
        conn: &mut AsyncPgConnection,
    ) -> QueryResult<Vec<DrawingDto>> {
        let drawing_updates = Vec::from(dto_vec);

        let result = conn
            .transaction(|transaction| {
                Box::pin(async {
                    let ids: Vec<Uuid> = drawing_updates.iter().map(|dto| dto.id).collect();

                    let futures = Self::do_update(drawing_updates, transaction);

                    futures_util::future::try_join_all(futures).await?;

                    let results = FilterDsl::filter(
                        drawings::table.select(drawings::all_columns),
                        drawings::id.eq_any(ids),
                    )
                    .load::<Self>(transaction)
                    .await?;

                    Ok(results) as QueryResult<Vec<Self>>
                })
            })
            .await?;

        Ok(result.into_iter().map(Into::into).collect())
    }

    /// Helper that performs the actual update of the drawings.
    fn do_update(
        updates: Vec<UpdateDrawing>,
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
        let query = diesel::delete(FilterDsl::filter(drawings::table, drawings::id.eq_any(ids)));
        debug!("{}", debug_query::<Pg, _>(&query));
        query.execute(conn).await
    }
}
