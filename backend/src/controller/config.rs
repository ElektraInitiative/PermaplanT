//! `Config` endpoints.

use actix_web::{get, HttpResponse};

use crate::config::auth;
use crate::model::dto::ConfigDto;

/// Endpoint for fetching configuration for the frontend.
#[allow(clippy::unused_async)]
#[utoipa::path(
    context_path = "/api/config",
    responses(
        (status = 200, description = "Fetch the config the frontend requires to run", body = ConfigDto)
    )
)]
#[get("")]
pub async fn get() -> HttpResponse {
    let config = auth::Config::get();
    let response = ConfigDto {
        issuer_uri: config.openid_configuration.issuer.clone(),
        client_id: config.client_id.clone(),
    };
    HttpResponse::Ok().json(response)
}
