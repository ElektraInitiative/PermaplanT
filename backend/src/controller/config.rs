//! `Config` endpoints.

use actix_web::{get, HttpResponse};

use crate::config::auth;
use lib_db::model::dto::ConfigDto;

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
        version: env!("CARGO_PKG_VERSION").to_owned(),
    };
    HttpResponse::Ok().json(response)
}
