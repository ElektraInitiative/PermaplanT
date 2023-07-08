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

/// The resolution of the generated heatmap in cm.
const GRANULARITY: f32 = 10.0;

#[derive(Debug, Clone, QueryableByName)]
struct BoundingBox {
    #[diesel(sql_type = Float)]
    x_min: f32,
    #[diesel(sql_type = Float)]
    y_min: f32,
    #[diesel(sql_type = Float)]
    x_max: f32,
    #[diesel(sql_type = Float)]
    y_max: f32,
}

/// Stores the score of a x,y coordinate on the heatmap.
#[derive(Debug, Clone, QueryableByName)]
struct HeatMapElement {
    /// The score on the heatmap.
    #[diesel(sql_type = Float)]
    score: f32,
    /// The x values of the score
    #[diesel(sql_type = Integer)]
    x: i32,
    /// The y values of the score.
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
    // Fetch the bounding box x and y values of the maps coordinates
    let query = diesel::sql_query("SELECT * FROM calculate_bbox($1)").bind::<Integer, _>(map_id);
    debug!("{}", debug_query::<Pg, _>(&query));
    let bounding_box = query.get_result::<BoundingBox>(conn).await?;

    // Fetch the heatmap
    let query = diesel::sql_query("SELECT * FROM calculate_score($1, $2, $3, $4, $5, $6, $7)")
        .bind::<Integer, _>(map_id)
        .bind::<Integer, _>(plant_id)
        .bind::<Float, _>(GRANULARITY)
        .bind::<Float, _>(bounding_box.x_min)
        .bind::<Float, _>(bounding_box.y_min)
        .bind::<Float, _>(bounding_box.x_max)
        .bind::<Float, _>(bounding_box.y_max);
    debug!("{}", debug_query::<Pg, _>(&query));
    let result = query.load::<HeatMapElement>(conn).await?;

    // Convert the result to a matrix.
    // Matrix will be from 0..0 to ((x_max - x_min) / granularity)..((y_max - y_min) / granularity).
    let mut heatmap =
        vec![
            vec![0.0; ((bounding_box.x_max - bounding_box.x_min) / GRANULARITY).ceil() as usize];
            ((bounding_box.y_max - bounding_box.y_min) / GRANULARITY).ceil() as usize
        ];
    for HeatMapElement { score, x, y } in result {
        heatmap[y as usize][x as usize] = score;
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
