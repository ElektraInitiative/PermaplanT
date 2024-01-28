//! Configuration of the server.

use std::env;

use dotenvy::dotenv;
use oauth2::{ClientId, ClientSecret, ResourceOwnerPassword, ResourceOwnerUsername};
use reqwest::Url;

/// Environment variables that are required for the configuration of the server.
pub struct EnvVars {
    pub bind_address_host: &'static str,
    pub bind_address_port: &'static str,
    pub database_url: &'static str,
    pub auth_discovery_uri: &'static str,
    pub auth_client_id: &'static str,
    pub keycloak_auth_uri: &'static str,
    pub keycloak_client_id: &'static str,
    pub keycloak_client_secret: &'static str,
    pub keycloak_username: &'static str,
    pub keycloak_password: &'static str,
}

/// Holds the names of all required environment variables
const ENV_VARS: EnvVars = EnvVars {
    bind_address_host: "BIND_ADDRESS_HOST",
    bind_address_port: "BIND_ADDRESS_PORT",
    database_url: "DATABASE_URL",
    auth_discovery_uri: "AUTH_DISCOVERY_URI",
    auth_client_id: "AUTH_CLIENT_ID",
    keycloak_auth_uri: "KEYCLOAK_AUTH_URI",
    keycloak_client_id: "KEYCLOAK_CLIENT_ID",
    keycloak_client_secret: "KEYCLOAK_CLIENT_SECRET",
    keycloak_username: "KEYCLOAK_USERNAME",
    keycloak_password: "KEYCLOAK_PASSWORD",
};

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

    /// The URI of the auth server used to acquire a token for the admin API.
    pub keycloak_auth_uri: Url,
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

        let host = env::var(ENV_VARS.bind_address_host)
            .map_err(|_| env_error(ENV_VARS.bind_address_host))?;
        let port = env::var(ENV_VARS.bind_address_port)
            .map_err(|_| env_error(ENV_VARS.bind_address_port))?
            .parse::<u16>()
            .map_err(|e| e.to_string())?;

        let database_url =
            env::var(ENV_VARS.database_url).map_err(|_| env_error(ENV_VARS.database_url))?;
        let auth_discovery_uri = env::var(ENV_VARS.auth_discovery_uri)
            .map_err(|_| env_error(ENV_VARS.auth_discovery_uri))?;
        let client_id =
            env::var(ENV_VARS.auth_client_id).map_err(|_| env_error(ENV_VARS.auth_client_id))?;

        let keycloak_auth_uri = env::var(ENV_VARS.keycloak_auth_uri)
            .map_err(|_| env_error(ENV_VARS.keycloak_auth_uri))?
            .parse::<Url>()
            .map_err(|e| e.to_string())?;
        let keycloak_client_id = env::var(ENV_VARS.keycloak_client_id)
            .map_err(|_| env_error(ENV_VARS.keycloak_client_id))?;
        let keycloak_client_secret = env::var(ENV_VARS.keycloak_client_secret)
            .map_err(|_| env_error(ENV_VARS.keycloak_client_secret))?;
        let keycloak_username = env::var(ENV_VARS.keycloak_username)
            .map_err(|_| env_error(ENV_VARS.keycloak_username))?;
        let keycloak_password = env::var(ENV_VARS.keycloak_password)
            .map_err(|_| env_error(ENV_VARS.keycloak_password))?;

        Ok(Self {
            bind_address: (host, port),
            database_url,
            auth_discovery_uri,
            client_id,
            keycloak_auth_uri,
            keycloak_client_id: ClientId::new(keycloak_client_id),
            keycloak_client_secret: ClientSecret::new(keycloak_client_secret),
            keycloak_username: ResourceOwnerUsername::new(keycloak_username),
            keycloak_password: ResourceOwnerPassword::new(keycloak_password),
        })
    }
}

/// Generates an error message for missing env variables
fn env_error(env_var: &str) -> String {
    format!("Failed to get {env_var} from environment")
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
