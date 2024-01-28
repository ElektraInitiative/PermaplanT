//! Configurations for the app data that is available to all controllers.

use crate::config::app::Config;
use crate::keycloak_api::client::KeycloakClient;
use crate::sse::broadcaster::Broadcaster;
use actix_web::web::Data;

use crate::db::connection;

/// Data available to all controllers.
pub struct AppDataInner {
    /// Connection pool to the database.
    pub pool: connection::Pool,
    /// Server-Sent Events broadcaster.
    pub broadcaster: Broadcaster,
    /// Client for the keycloak admin API
    pub keycloak_client: KeycloakClient,
}

/// Initializes the app data that is available to all controllers.
///
/// # Panics
/// If the database pool can not be initialized.
#[must_use]
pub fn init(config: &Config) -> Data<AppDataInner> {
    let pool = connection::init_pool(&config.database_url);
    let broadcaster = Broadcaster::new();
    let keycloak_client = KeycloakClient::new(&config);

    Data::new(AppDataInner {
        pool,
        broadcaster,
        keycloak_client,
    })
}
