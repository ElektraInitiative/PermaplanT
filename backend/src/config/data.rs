//! Configurations for shared data that is available to all controllers.

use actix_web::web::Data;

use crate::config::app::Config;
use crate::db::connection;
use crate::keycloak_api;
use crate::sse::broadcaster::Broadcaster;

/// Helper-Type - Connection pool to the database.
pub type SharedPool = Data<connection::Pool>;

/// Helper-Type - Server-Sent Events broadcaster.
pub type SharedBroadcaster = Data<Broadcaster>;

/// Helper-Type - Keycloak admin API.
pub type SharedKeycloakApi = Data<keycloak_api::api::Api>;

/// Helper-Type - Pooled HTTP client.
pub type SharedHttpClient = Data<reqwest::Client>;

/// Data-structure holding the initialized shared data.
pub struct SharedInit {
    /// Connection pool to the database.
    pub pool: SharedPool,
    /// Server-Sent Events broadcaster.
    pub broadcaster: SharedBroadcaster,
    /// Keycloak admin API.
    pub keycloak_api: SharedKeycloakApi,
    /// Pooled HTTP client.
    pub http_client: SharedHttpClient,
}

/// Initializes shared data.
///
/// # Panics
/// If the database pool can not be initialized.
#[must_use]
pub fn init(config: &Config) -> SharedInit {
    SharedInit {
        pool: Data::new(connection::init_pool(&config.database_url)),
        broadcaster: Data::new(Broadcaster::new()),
        keycloak_api: Data::new(keycloak_api::api::Api::new(config)),
        http_client: Data::new(reqwest::Client::new()),
    }
}
