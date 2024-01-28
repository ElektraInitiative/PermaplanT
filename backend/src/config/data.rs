//! Configurations for the app data that is available to all controllers.

use actix_web::web::Data;

use crate::config::app::Config;
use crate::db::connection;
use crate::keycloak_api::api::KeycloakApi;
use crate::sse::broadcaster::Broadcaster;

/// Data available to all controllers.
pub struct AppDataInner {
    /// Connection pool to the database.
    pub pool: connection::Pool,
    /// Server-Sent Events broadcaster.
    pub broadcaster: Broadcaster,
    /// Keycloak admin API.
    pub keycloak_api: KeycloakApi,
    /// Pooled HTTP client.
    pub http_client: reqwest::Client,
}

/// Initializes the app data that is available to all controllers.
///
/// # Panics
/// If the database pool can not be initialized.
#[must_use]
pub fn init(config: &Config) -> Data<AppDataInner> {
    let pool = connection::init_pool(&config.database_url);
    let broadcaster = Broadcaster::new();
    let keycloak_api = KeycloakApi::new(&config);
    let http_client = reqwest::Client::new();

    Data::new(AppDataInner {
        pool,
        broadcaster,
        keycloak_api,
        http_client,
    })
}
