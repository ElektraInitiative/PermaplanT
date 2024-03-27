//! `GuidedTours` endpoints.

use actix_web::{get, patch, post, web::Json, HttpResponse, Result};

use crate::config::data::SharedPool;
use crate::{config::auth::user_info::UserInfo, model::dto::UpdateGuidedToursDto, service};

/// Endpoint for setting up a [`GuidedTours`](crate::model::entity::GuidedTours) object.
///
/// # Errors
/// * If the connection to the database could not be established.
#[utoipa::path(
    context_path = "/api/tours",
    responses(
        (status = 201, description = "Setup a Guided Tour status object for the requesting user", body = GuidedToursDto)
    ),
    security(
        ("oauth2" = [])
    )
)]
#[post("")]
pub async fn setup(user_info: UserInfo, pool: SharedPool) -> Result<HttpResponse> {
    let response = service::guided_tours::setup(user_info.id, &pool).await?;
    Ok(HttpResponse::Created().json(response))
}

/// Endpoint for fetching a [`GuidedTours`](crate::model::entity::GuidedTours) object.
///
/// # Errors
/// * If the connection to the database could not be established.
#[utoipa::path(
    context_path = "/api/tours",
    responses(
        (status = 200, description = "Fetch the Guided Tour status object of the requesting user", body = GuidedToursDto)
    ),
    security(
        ("oauth2" = [])
    )
)]
#[get("")]
pub async fn find_by_user(user_info: UserInfo, pool: SharedPool) -> Result<HttpResponse> {
    let response = service::guided_tours::find_by_user(user_info.id, &pool).await?;
    Ok(HttpResponse::Ok().json(response))
}

/// Endpoint for updating a [`GuidedTours`](crate::model::entity::GuidedTours) object.
///
/// # Errors
/// * If the connection to the database could not be established.
#[utoipa::path(
    context_path = "/api/tours",
    request_body = UpdateGuidedToursDto,
    responses(
        (status = 200, description = "Update the Guided Tour status object of the requesting user", body = GuidedToursDto)
    ),
    security(
        ("oauth2" = [])
    )
)]
#[patch("")]
pub async fn update(
    status_update_json: Json<UpdateGuidedToursDto>,
    user_info: UserInfo,
    pool: SharedPool,
) -> Result<HttpResponse> {
    let response = service::guided_tours::update(status_update_json.0, user_info.id, &pool).await?;
    Ok(HttpResponse::Ok().json(response))
}
