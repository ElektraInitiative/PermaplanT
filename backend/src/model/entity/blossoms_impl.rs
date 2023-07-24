//! Contains the implementation of [`GainedBlossoms`].

use diesel::pg::Pg;
use diesel::{debug_query, QueryResult};
use diesel_async::{AsyncPgConnection, RunQueryDsl};
use log::debug;
use uuid::Uuid;

use crate::model::dto::GainedBlossomsDto;
use crate::schema::gained_blossoms;

use super::GainedBlossoms;

impl GainedBlossoms {
    /// Deposits a new Blossom as gained by the user in the database.
    ///
    /// # Errors
    /// * Unknown, diesel doesn't say why it might error.
    pub async fn create(
        gained_blossom: GainedBlossomsDto,
        user_id: Uuid,
        conn: &mut AsyncPgConnection,
    ) -> QueryResult<GainedBlossomsDto> {
        let gained_blossom = Self::from((gained_blossom, user_id));
        let query = diesel::insert_into(gained_blossoms::table).values(&gained_blossom);
        debug!("{}", debug_query::<Pg, _>(&query));
        query.get_result::<Self>(conn).await.map(Into::into)
    }
}
