use actix_web::web::Data;

use crate::{
    config::data::AppDataInner,
    error::ServiceError,
    model::{
        dto::timeline::{TimelineDto, TimelineParameters},
        entity::timeline,
    },
};

/// Summarizes the all additions and removals of plantings
/// between `params.start` and `params.end`.
///
/// # Errors
/// If the connection to the database could not be established.
pub async fn calculate(
    params: TimelineParameters,
    app_data: &Data<AppDataInner>,
) -> Result<TimelineDto, ServiceError> {
    let mut conn = app_data.pool.get().await?;
    let result = timeline::calculate(params, &mut conn).await?;
    Ok(result)
}
