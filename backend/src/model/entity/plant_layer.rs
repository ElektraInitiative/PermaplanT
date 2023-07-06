//! Contains the database implementation of the plant layer.

use diesel::{
    debug_query,
    pg::Pg,
    sql_types::{Float, Integer},
    CombineDsl, ExpressionMethods, QueryDsl, QueryResult, QueryableByName,
};
use diesel_async::{AsyncPgConnection, RunQueryDsl};
use log::debug;

use crate::{
    model::{
        dto::{RelationDto, RelationSearchParameters, RelationsDto},
        r#enum::relation_type::RelationType,
    },
    schema::relations,
};

#[derive(Debug, Clone, QueryableByName)]
struct HeatMapElement {
    #[diesel(sql_type = Float)]
    score: f32,
    #[diesel(sql_type = Integer)]
    x: i32,
    #[diesel(sql_type = Integer)]
    y: i32,
}

/// Generates a heatmap signaling ideal locations for planting the plant.
///
/// # Errors
/// * If the SQL query failed.
#[allow(clippy::cast_sign_loss, clippy::indexing_slicing)]
pub async fn heatmap(
    map_id: i32,
    plant_id: i32,
    conn: &mut AsyncPgConnection,
) -> QueryResult<Vec<Vec<f32>>> {
    // TODO: Compute from the maps geometry
    let num_rows = 10; // TODO: Calculate number of rows
    let num_cols = 10; // TODO: Calculate number of columns

    let query = diesel::sql_query("SELECT * FROM calculate_score($1, $2, $3, $4)")
        .bind::<Integer, _>(map_id)
        .bind::<Integer, _>(plant_id)
        .bind::<Integer, _>(num_rows)
        .bind::<Integer, _>(num_cols);

    let result = query.load::<HeatMapElement>(conn).await?;

    let mut heatmap = vec![vec![0.0; num_cols as usize]; num_rows as usize];
    for HeatMapElement { score, x, y } in result {
        heatmap[x as usize][y as usize] = score;
    }
    Ok(heatmap)
}

/// Get all relations of a certain plant.
///
/// # Errors
/// * If the SQL query failed.
pub async fn find_relations(
    search_query: RelationSearchParameters,
    conn: &mut AsyncPgConnection,
) -> QueryResult<RelationsDto> {
    let query = relations::table
        .select((relations::plant1, relations::relation))
        .filter(relations::plant1.eq(&search_query.plant_id))
        .union(
            relations::table
                .select((relations::plant2, relations::relation))
                .filter(relations::plant2.eq(&search_query.plant_id)),
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
