use actix_web::web::Data;

use crate::{
    config::data::AppDataInner,
    error::ServiceError,
    model::{
        dto::timeline::{TimelineDto, TimelineParameters},
        entity::{timeline, Map},
    },
};

/// Summarizes the all additions and removals of plantings
/// between `params.start` and `params.end`.
///
/// # Errors
/// If the connection to the database could not be established.
pub async fn calculate(
    map_id: i32,
    params: TimelineParameters,
    app_data: &Data<AppDataInner>,
) -> Result<TimelineDto, ServiceError> {
    let mut conn = app_data.pool.get().await?;
    // Check if the map exists
    Map::find_by_id(map_id, &mut conn).await?;
    let result = timeline::calculate(map_id, params, &mut conn).await?;
    Ok(result)
}
