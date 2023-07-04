//! Service layer for plant layer.

use actix_web::web::Data;

use crate::{
    config::data::AppDataInner,
    error::ServiceError,
    model::{
        dto::{RelationSearchParameters, RelationsDto},
        entity::plant_layer,
    },
};

/// Get all relations of a certain plant.
///
/// # Errors
/// If the connection to the database could not be established.
pub async fn find_relations(
    search_query: RelationSearchParameters,
    app_data: &Data<AppDataInner>,
) -> Result<RelationsDto, ServiceError> {
    let mut conn = app_data.pool.get().await?;
    let result = plant_layer::find_relations(search_query, &mut conn).await?;
    Ok(result)
}
