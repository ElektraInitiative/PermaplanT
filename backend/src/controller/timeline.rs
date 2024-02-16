//! `Users` endpoints.
use crate::config::data::AppDataInner;
use crate::model::dto::timeline::TimelineParameters;
use crate::service;
use actix_web::{
    get,
    web::{Data, Path, Query},
    HttpResponse, Result,
};

/// Endpoint for gettings generated timeline data.
///
/// # Errors
/// * If the connection to the database could not be established.
#[utoipa::path(
    context_path = "/api/maps/{map_id}/timeline",
    params(
        TimelineParameters
    ),
    responses(
      (status = 200, description = "Get timeline data from plantings", body = TimelineDto)
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
    let dto = service::timeline::calculate(map_id.into_inner(), params, &app_data).await?;
    Ok(HttpResponse::Ok().json(dto))
}
