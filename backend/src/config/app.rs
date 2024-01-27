//! Configuration of the server.

use std::env;

use dotenvy::dotenv;
use oauth2::{ClientId, ClientSecret, ResourceOwnerPassword, ResourceOwnerUsername};

/// Configuration data for the server.
pub struct Config {
    /// The address and port the server should be started on.
    pub bind_address: (String, u16),
    /// The location of the database as a URL.
    pub database_url: String,
    /// The discovery URI of the server that issues tokens.
    ///
    /// Can be used to fetch other relevant URLs such as the `jwks_uri` or the `token_endpoint`.
    pub auth_discovery_uri: String,
    /// The `client_id` the frontend should use to log in its users.
    pub client_id: String,

    /// The `client_id` the backend uses to communicate with the auth server.
    pub keycloak_client_id: ClientId,
    /// The `client_secret` the backend uses to communicate with the auth server.
    pub keycloak_client_secret: ClientSecret,
    /// The `username` the backend uses to communicate with the auth server.
    pub keycloak_username: ResourceOwnerUsername,
    /// The `password` the backend uses to communicate with the auth server.
    pub keycloak_password: ResourceOwnerPassword,
}

impl Config {
    /// Load the configuration using environment variables.
    ///
    /// # Errors
    /// * If the .env file is present, but there was an error loading it.
    /// * If an environment variable is missing.
    /// * If a variable could not be parsed correctly.
    pub fn from_env() -> Result<Self, Box<dyn std::error::Error>> {
        load_env_file()?;

        let host = env::var("BIND_ADDRESS_HOST")
            .map_err(|_| "Failed to get BIND_ADDRESS_HOST from environment.")?;
        let port = env::var("BIND_ADDRESS_PORT")
            .map_err(|_| "Failed to get BIND_ADDRESS_PORT from environment.")?
            .parse::<u16>()
            .map_err(|e| e.to_string())?;

        let database_url =
            env::var("DATABASE_URL").map_err(|_| "Failed to get DATABASE_URL from environment.")?;
        let auth_discovery_uri = env::var("AUTH_DISCOVERY_URI")
            .map_err(|_| "Failed to get AUTH_DISCOVERY_URI from environment.")?;
        let client_id = env::var("AUTH_CLIENT_ID")
            .map_err(|_| "Failed to get AUTH_CLIENT_ID from environment.")?;

        let keycloak_client_id = env::var("KEYCLOAK_CLIENT_ID")
            .map_err(|_| "Failed to get KEYCLOAK_CLIENT_ID from environment.")?;
        let keycloak_client_secret = env::var("KEYCLOAK_CLIENT_SECRET")
            .map_err(|_| "Failed to get KEYCLOAK_CLIENT_SECRET from environment.")?;
        let keycloak_username = env::var("KEYCLOAK_USERNAME")
            .map_err(|_| "Failed to get KEYCLOAK_USERNAME from environment.")?;
        let keycloak_password = env::var("KEYCLOAK_PASSWORD")
            .map_err(|_| "Failed to get KEYCLOAK_PASSWORD from environment.")?;

        Ok(Self {
            bind_address: (host, port),
            database_url,
            auth_discovery_uri,
            client_id,
            keycloak_client_id: ClientId::new(keycloak_client_id),
            keycloak_client_secret: ClientSecret::new(keycloak_client_secret),
            keycloak_username: ResourceOwnerUsername::new(keycloak_username),
            keycloak_password: ResourceOwnerPassword::new(keycloak_password),
        })
    }
}

/// Load the .env file. A missing file does not result in an error.
///
/// # Errors
/// * If the .env file is present, but there was an error loading it.
fn load_env_file() -> Result<(), Box<dyn std::error::Error>> {
    match dotenv() {
        Err(e) if e.not_found() => Ok(()), // missing .env is ok
        Err(e) => Err(e.into()),           // any other errors are a problem
        _ => Ok(()),
    }
}
