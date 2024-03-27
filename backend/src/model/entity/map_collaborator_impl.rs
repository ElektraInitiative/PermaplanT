use diesel::{debug_query, pg::Pg, ExpressionMethods, QueryDsl, QueryResult};
use diesel_async::{AsyncPgConnection, RunQueryDsl};
use log::debug;

use crate::{
    model::dto::{DeleteMapCollaboratorDto, NewMapCollaboratorDto},
    schema::map_collaborators,
};

use super::MapCollaborator;

impl MapCollaborator {
    /// Create a new map collaborator.
    ///
    /// # Errors
    /// * Unknown, diesel doesn't say why it might error.
    pub async fn create(
        map_and_collaborator: (i32, NewMapCollaboratorDto),
        conn: &mut AsyncPgConnection,
    ) -> QueryResult<Self> {
        let new_map_collaborator = Self::from(map_and_collaborator);

        let query = diesel::insert_into(map_collaborators::table).values(&new_map_collaborator);
        debug!("{}", debug_query::<Pg, _>(&query));
        query.get_result::<Self>(conn).await.map(Into::into)
    }

    /// Find all map collaborators of a map.
    ///
    /// # Errors
    /// * Unknown, diesel doesn't say why it might error.
    pub async fn find_by_map_id(
        map_id: i32,
        conn: &mut AsyncPgConnection,
    ) -> QueryResult<Vec<Self>> {
        let query = map_collaborators::table.filter(map_collaborators::map_id.eq(map_id));
        debug!("{}", debug_query::<Pg, _>(&query));
        query.get_results::<Self>(conn).await
    }

    /// Delete a collaborator of a map.
    ///
    /// # Errors
    /// * Unknown, diesel doesn't say why it might error.
    pub async fn delete(
        map_and_dto: (i32, DeleteMapCollaboratorDto),
        conn: &mut AsyncPgConnection,
    ) -> QueryResult<()> {
        let (map_id, dto) = map_and_dto;

        let query = diesel::delete(map_collaborators::table.find((map_id, dto.user_id)));
        debug!("{}", debug_query::<Pg, _>(&query));
        query.execute(conn).await?;

        Ok(())
    }
}
