//! Contains the implementation of [`Users`].

use diesel::{debug_query, pg::Pg, QueryResult};
use diesel_async::{AsyncPgConnection, RunQueryDsl};
use log::debug;
use uuid::Uuid;

use crate::{model::dto::UsersDto, schema::users};

use super::Users;

impl Users {
    /// Create a user data entry for a new user.
    ///
    /// # Errors
    /// * Unknown, diesel doesn't say why it might error.
    pub async fn create(
        user_data: UsersDto,
        user_id: Uuid,
        conn: &mut AsyncPgConnection,
    ) -> QueryResult<UsersDto> {
        let user_data = Self::from((user_data, user_id));
        let query = diesel::insert_into(users::table).values(&user_data);
        debug!("{}", debug_query::<Pg, _>(&query));
        query.get_result::<Self>(conn).await.map(Into::into)
    }
}
