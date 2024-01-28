//! `Users` endpoints.
use crate::config::data::AppDataInner;
use crate::model::dto::timeline::TimelineParameters;
use crate::service;
use actix_web::{
    get,
    web::{Data, Query},
    HttpResponse, Result,
};

/// Endpoint for gettings generated timeline data.
///
/// # Errors
/// * If the connection to the database could not be established.
#[utoipa::path(
    context_path = "/api/timeline",
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
#[get("")]
pub async fn get_timeline(
    parameters: Query<TimelineParameters>,
    app_data: Data<AppDataInner>,
) -> Result<HttpResponse> {
    let params = parameters.into_inner();
    let dto = service::timeline::calculate_timeline(params, &app_data).await?;
    Ok(HttpResponse::Ok().json(dto))
}
