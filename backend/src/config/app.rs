//! Configuration of the server.

use std::env;

use dotenvy::dotenv;

/// Configuration data for the server.
pub struct Config {
    /// The address and port the server should be started on.
    pub bind_address: (String, u16),
    /// The location of the database as a URL.
    pub database_url: String,
}

impl Config {
    /// Load the configuration using environment variables.
    ///
    /// # Errors
    /// * If the .env file is missing.
    /// * If an environment variable is missing.
    /// * If a variable could not be parsed correctly.
    pub fn from_env() -> Result<Self, Box<dyn std::error::Error>> {
        dotenv().map_err(|_| ".env file not found")?;

        let host = env::var("BIND_ADDRESS_HOST")
            .map_err(|_| "Failed to get BIND_ADDRESS_HOST from environment.")?;
        let port = env::var("BIND_ADDRESS_PORT")
            .map_err(|_| "Failed to get BIND_ADDRESS_PORT from environment.")?
            .parse::<u16>()
            .map_err(|e| e.to_string())?;

        let database_url =
            env::var("DATABASE_URL").map_err(|_| "Failed to get DATABASE_URL from environment.")?;

        Ok(Self {
            bind_address: (host, port),
            database_url,
        })
    }
}
