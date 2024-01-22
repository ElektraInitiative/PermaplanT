use actix_web::web::Data;

use crate::{
    config::data::AppDataInner,
    error::ServiceError,
    model::{
        dto::timeline::{TimelineDto, TimelineParameters},
        entity::timeline,
    },
};

pub async fn calculate_timeline(
    params: TimelineParameters,
    app_data: &Data<AppDataInner>,
) -> Result<TimelineDto, ServiceError> {
    let mut conn = app_data.pool.get().await?;
    let result = timeline::calculate(params, &mut conn).await?;
    Ok(result)
}
