//! Contains the implementation of [`BlossomsGained`].

use diesel::pg::Pg;
use diesel::{debug_query, QueryResult};
use diesel_async::{AsyncPgConnection, RunQueryDsl};
use log::debug;
use uuid::Uuid;

use crate::model::dto::BlossomsGainedDto;
use crate::schema::blossoms_gained;

use super::BlossomsGained;

impl BlossomsGained {
    /// Deposits a new Blossom as gained by the user in the database.
    ///
    /// # Errors
    /// * Unknown, diesel doesn't say why it might error.
    pub async fn create(
        gained_blossom: BlossomsGainedDto,
        user_id: Uuid,
        conn: &mut AsyncPgConnection,
    ) -> QueryResult<BlossomsGainedDto> {
        let gained_blossom = BlossomsGained::from((gained_blossom, user_id));
        let query = diesel::insert_into(blossoms_gained::table).values(&gained_blossom);
        debug!("{}", debug_query::<Pg, _>(&query));
        query.get_result::<Self>(conn).await.map(Into::into)
    }
}
