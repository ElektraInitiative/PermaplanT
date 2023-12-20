//! Contains the implementation of [`Shading`].

use chrono::NaiveDate;
use diesel::pg::Pg;
use diesel::{debug_query, BoolExpressionMethods, ExpressionMethods, QueryDsl, QueryResult};
use diesel_async::{AsyncPgConnection, RunQueryDsl};
use log::debug;
use uuid::Uuid;

use crate::model::dto::shadings::{NewShadingDto, ShadingDto, UpdateShadingDto};
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
        dto: NewShadingDto,
        conn: &mut AsyncPgConnection,
    ) -> QueryResult<ShadingDto> {
        let shading = Self::from(dto);
        let query = diesel::insert_into(shadings::table).values(&shading);
        debug!("{}", debug_query::<Pg, _>(&query));
        query.get_result::<Self>(conn).await.map(Into::into)
    }

    /// Partially update a shading in the database.
    ///
    /// # Errors
    /// * Unknown, diesel doesn't say why it might error.
    pub async fn update(
        shading_id: Uuid,
        dto: UpdateShadingDto,
        conn: &mut AsyncPgConnection,
    ) -> QueryResult<ShadingDto> {
        let shading = UpdateShading::from(dto);
        let query = diesel::update(shadings::table.find(shading_id)).set(&shading);
        debug!("{}", debug_query::<Pg, _>(&query));
        query.get_result::<Self>(conn).await.map(Into::into)
    }

    /// Delete the shading from the database.
    ///
    /// # Errors
    /// * Unknown, diesel doesn't say why it might error.
    pub async fn delete_by_id(id: Uuid, conn: &mut AsyncPgConnection) -> QueryResult<usize> {
        let query = diesel::delete(shadings::table.find(id));
        debug!("{}", debug_query::<Pg, _>(&query));
        query.execute(conn).await
    }
}
