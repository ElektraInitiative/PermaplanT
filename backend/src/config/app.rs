//! Configuration of the server.

use std::env;

use dotenvy::dotenv;

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

        Ok(Self {
            bind_address: (host, port),
            database_url,
            auth_discovery_uri,
            client_id,
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
