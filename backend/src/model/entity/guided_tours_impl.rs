//! Contains the implementation of [`GuidedTours`].

use diesel::{debug_query, pg::Pg, QueryDsl, QueryResult};
use diesel_async::{AsyncPgConnection, RunQueryDsl};
use log::debug;
use uuid::Uuid;

use crate::{
    model::{
        dto::{GuidedToursDto, UpdateGuidedToursDto},
        entity::UpdateGuidedTours,
    },
    schema::guided_tours,
};

use super::GuidedTours;

impl GuidedTours {
    /// Setup Guided Tours status object for a new user.
    ///
    /// # Errors
    /// * Unknown, diesel doesn't say why it might error.
    pub async fn setup(user_id: Uuid, conn: &mut AsyncPgConnection) -> QueryResult<GuidedToursDto> {
        let new_guided_tours = Self::from(user_id);
        let query = diesel::insert_into(guided_tours::table).values(new_guided_tours);
        debug!("{}", debug_query::<Pg, _>(&query));
        query.get_result::<Self>(conn).await.map(Into::into)
    }

    /// Get Guided Tours status object for a user.
    ///
    /// # Errors
    /// * Unknown, diesel doesn't say why it might error.
    pub async fn find_by_user(
        user_id: Uuid,
        conn: &mut AsyncPgConnection,
    ) -> QueryResult<GuidedToursDto> {
        let query = guided_tours::table.find(user_id);
        debug!("{}", debug_query::<Pg, _>(&query));
        query.first::<Self>(conn).await.map(Into::into)
    }

    /// Update Guided Tours status object for a user.
    ///
    /// # Errors
    /// * Unknown, diesel doesn't say why it might error.
    pub async fn update(
        status_update: UpdateGuidedToursDto,
        user_id: Uuid,
        conn: &mut AsyncPgConnection,
    ) -> QueryResult<GuidedToursDto> {
        let status_update = UpdateGuidedTours::from(status_update);
        let query = diesel::update(guided_tours::table.find(user_id)).set(&status_update);
        debug!("{}", debug_query::<Pg, _>(&query));
        query.get_result::<Self>(conn).await.map(Into::into)
    }
}
