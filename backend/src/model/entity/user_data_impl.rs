//! Contains the implementation of [`UserData`].

use diesel::{debug_query, pg::Pg, QueryDsl, QueryResult};
use diesel_async::{AsyncPgConnection, RunQueryDsl};
use log::debug;
use uuid::Uuid;

use crate::{
    model::dto::{GuidedToursDto, UserDataDto},
    schema::user_data,
};

use super::UserData;

impl UserData {
    /// Fetch status of guided tours for a given user from the database.
    ///
    /// # Errors
    /// * Unknown, diesel doesn't say why it might error.
    pub async fn guided_tours(
        user_id: Uuid,
        conn: &mut AsyncPgConnection,
    ) -> QueryResult<GuidedToursDto> {
        let query = user_data::table.find(user_id);
        debug!("{}", debug_query::<Pg, _>(&query));
        query.first::<Self>(conn).await.map(Into::into)
    }

    /// Create a user data entry for a new user.
    ///
    /// # Errors
    /// * Unknown, diesel doesn't say why it might error.
    pub async fn create(
        user_data: UserDataDto,
        user_id: Uuid,
        conn: &mut AsyncPgConnection,
    ) -> QueryResult<UserDataDto> {
        let user_data = UserData::from((user_data, user_id));
        let query = diesel::insert_into(user_data::table).values(&user_data);
        debug!("{}", debug_query::<Pg, _>(&query));
        query.get_result::<Self>(conn).await.map(Into::into)
    }
}
