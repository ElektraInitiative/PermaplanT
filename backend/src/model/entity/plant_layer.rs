//! Contains the database implementation of the plant layer.

use diesel::{
    debug_query,
    pg::Pg,
    sql_types::{Double, Integer},
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
pub struct HeatMapElement {
    #[diesel(sql_type = Double)]
    pub score: f64,
    #[diesel(sql_type = Integer)]
    pub x: i32,
    #[diesel(sql_type = Integer)]
    pub y: i32,
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
) -> QueryResult<Vec<Vec<f64>>> {
    // TODO: Compute from the maps geometry
    let num_rows = 10; // TODO: Calculate number of rows
    let num_cols = 10; // TODO: Calculate number of columns

    let query = diesel::sql_query("SELECT * FROM calculate_score($1, $2, $3, $4)")
        .bind::<Integer, _>(map_id)
        .bind::<Integer, _>(plant_id)
        .bind::<Integer, _>(num_rows)
        .bind::<Integer, _>(num_cols);

    let result = query.load::<HeatMapElement>(conn).await?;

    // TODO: figure out how to handle actual values (return matrix to frontend, create image, return matrix as binary?)
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
