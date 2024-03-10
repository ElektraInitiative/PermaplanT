//! `Users` endpoints.
use crate::config::data::AppDataInner;
use crate::service;
use actix_web::{
    get,
    web::{Data, Path, Query},
    HttpResponse, Result,
};
use lib_db::model::dto::timeline::TimelineParameters;

/// Get calculated timeline data for a given map from dates start to end.
/// The timeline contains all additions and removals of `Plantings` aggregated
/// by years, months, and also on the actual dates. It only contains years, months
/// and dates if there is at least one addition or removal.
///
/// # Errors
/// * If the connection to the database could not be established.
#[utoipa::path(
    context_path = "/api/maps/{map_id}/timeline",
    params(
        TimelineParameters
    ),
    responses(
      (status = 200, description = "Get timeline data from plantings", body = TimelineDto),
      (status = 404, description = "Map not found", body = TimelineDto),
      (status = 422, description = "Start is not smaller than end", body = TimelineDto)
    ),
    security(
        ("oauth2" = [])
    )
)]
#[get("timeline")]
pub async fn get_timeline(
    map_id: Path<i32>,
    parameters: Query<TimelineParameters>,
    app_data: Data<AppDataInner>,
) -> Result<HttpResponse> {
    let params = parameters.into_inner();
    if params.start > params.end {
        return Ok(HttpResponse::UnprocessableEntity().body("Start must be smaller than end"));
    }
    let dto = service::timeline::calculate(map_id.into_inner(), params, &app_data).await?;
    Ok(HttpResponse::Ok().json(dto))
}
