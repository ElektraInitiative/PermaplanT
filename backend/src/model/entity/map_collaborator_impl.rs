use diesel::{debug_query, pg::Pg, QueryResult};
use diesel_async::{AsyncPgConnection, RunQueryDsl};
use log::debug;

use crate::{model::dto::NewMapCollaboratorDto, schema::map_collaborators};

use super::MapCollaborator;

impl MapCollaborator {
    pub async fn create(
        new_map_collaborator: NewMapCollaboratorDto,
        conn: &mut AsyncPgConnection,
    ) -> QueryResult<Self> {
        let new_map_collaborator = MapCollaborator::from(new_map_collaborator);

        let query = diesel::insert_into(map_collaborators::table).values(&new_map_collaborator);
        debug!("{}", debug_query::<Pg, _>(&query));
        query.get_result::<Self>(conn).await.map(Into::into)
    }
}
