use std::{env, num::ParseIntError};

pub struct Config {
    pub bind_address: (String, u16),
    pub database_url: String,
}

impl Config {
    pub fn from_env() -> Result<Self, Box<dyn std::error::Error>> {
        let host = env::var("BIND_ADDRESS_HOST")
            .map_err(|_| "Failed to get BIND_ADDRESS_HOST from environment.")?;
        let port = env::var("BIND_ADDRESS_PORT")
            .map_err(|_| "Failed to get BIND_ADDRESS_PORT from environment.")?;
        let port: u16 = port.parse().map_err(|e: ParseIntError| e.to_string())?;
        let bind_address = (host, port);
        let database_url =
            env::var("DATABASE_URL").map_err(|_| "Failed to get DATABASE_URL from environment.")?;

        Ok(Self {
            bind_address,
            database_url,
        })
    }
}
