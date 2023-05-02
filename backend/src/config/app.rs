//! Configuration of the server.

use std::env;

use dotenvy::dotenv;

/// Configuration data for the server.
pub struct Config {
    /// The address and port the server should be started on.
    pub bind_address: (String, u16),
    /// The location of the database as a URL.
    pub database_url: String,
    /// The location of the authorization server.
    ///
    /// Will be used to fetch jwks to validate tokens.
    pub auth_server_url: String,
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
        let auth_server_url = env::var("AUTH_SERVER_URL")
            .map_err(|_| "Failed to get AUTH_SERVER_URL from environment.")?;

        Ok(Self {
            bind_address: (host, port),
            database_url,
            auth_server_url,
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
