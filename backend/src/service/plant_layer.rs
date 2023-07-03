//! Service layer for plant layer.

use actix_web::web::Data;

use crate::{
    config::data::AppDataInner,
    error::ServiceError,
    model::{
        dto::{HeatMapQueryParams, RelationSearchParameters, RelationsDto},
        entity::plant_layer,
    },
};

/// Generates a heatmap signaling ideal locations for planting the plant.
///
/// # Errors
/// * If the connection to the database could not be established.
/// * If the SQL query failed.
pub async fn heatmap(
    map_id: i32,
    query_params: HeatMapQueryParams,
    app_data: &Data<AppDataInner>,
) -> Result<Vec<Vec<f64>>, ServiceError> {
    let mut conn = app_data.pool.get().await?;
    let result = plant_layer::heatmap(map_id, query_params.plant_id, &mut conn).await?;
    Ok(result)
}

/// Get all relations of a certain plant.
///
/// # Errors
/// * If the connection to the database could not be established.
/// * If the SQL query failed.
pub async fn find_relations(
    search_query: RelationSearchParameters,
    app_data: &Data<AppDataInner>,
) -> Result<RelationsDto, ServiceError> {
    let mut conn = app_data.pool.get().await?;
    let result = plant_layer::find_relations(search_query, &mut conn).await?;
    Ok(result)
}
