//! Contains the database implementation of the plant layer.

use diesel::{
    debug_query, pg::Pg, CombineDsl, ExpressionMethods, JoinOnDsl, QueryDsl, QueryResult,
};
use diesel_async::{AsyncPgConnection, RunQueryDsl};
use log::debug;

use crate::{
    model::{
        dto::{RelationDto, RelationSearchParameters, RelationsDto},
        r#enum::relation_type::RelationType,
    },
    schema::{plants, relations},
};

/// Get all relations of a certain plant.
///
/// # Errors
/// * Unknown, diesel doesn't say why it might error.
pub async fn find_relations(
    search_query: RelationSearchParameters,
    conn: &mut AsyncPgConnection,
) -> QueryResult<RelationsDto> {
    let query = relations::table
        .inner_join(plants::table.on(relations::plant1.eq(plants::unique_name)))
        .select((plants::id, relations::relation))
        .filter(plants::id.eq(&search_query.plant_id))
        .union(
            relations::table
                .inner_join(plants::table.on(relations::plant2.eq(plants::unique_name)))
                .select((plants::id, relations::relation))
                .filter(plants::id.eq(&search_query.plant_id)),
        );
    debug!("{}", debug_query::<Pg, _>(&query));
    let relations = query
        .load::<(i32, RelationType)>(conn)
        .await?
        .into_iter()
        .map(|(id, relation)| RelationDto { id, relation })
        .collect();
    Ok(RelationsDto {
        id: search_query.plant_id,
        relations,
    })
}
