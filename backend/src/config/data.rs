//! Configurations for shared data that is available to all controllers.

use std::sync::Arc;

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
pub type SharedKeycloakApi = Data<dyn keycloak_api::traits::KeycloakApi + Send + Sync + 'static>;

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
    let api = Data::from(create_api(config));

    SharedInit {
        keycloak_api: api,
        pool: Data::new(connection::init_pool(&config.database_url)),
        broadcaster: Data::new(Broadcaster::new()),
        http_client: Data::new(reqwest::Client::new()),
    }
}

/// Creates a new Keycloak API.
/// If the admin client ID and secret are not set, a mock API is created.
#[must_use]
pub fn create_api(
    config: &Config,
) -> Arc<dyn keycloak_api::traits::KeycloakApi + Send + Sync + 'static> {
    if let (Some(client_id), Some(client_secret)) = (
        config.auth_admin_client_id.clone(),
        config.auth_admin_client_secret.clone(),
    ) {
        Arc::new(keycloak_api::api::Api::new(keycloak_api::api::Config {
            token_url: config.auth_token_uri.clone(),
            client_id,
            client_secret,
        }))
    } else {
        log::info!("Using mock Keycloak API");
        Arc::new(keycloak_api::mock_api::MockApi)
    }
}
