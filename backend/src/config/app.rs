//! Configuration of the server.

use std::env;

use dotenvy::dotenv;
use reqwest::Url;
use secrecy::Secret;

/// Environment variables that are required for the configuration of the server.
pub struct EnvVars {
    pub bind_address_host: &'static str,
    pub bind_address_port: &'static str,
    pub database_url: &'static str,
    pub auth_host: &'static str,
    pub auth_client_id: &'static str,
    pub auth_admin_client_id: &'static str,
    pub auth_admin_client_secret: &'static str,
}

/// Holds the names of all required environment variables
const ENV_VARS: EnvVars = EnvVars {
    bind_address_host: "BIND_ADDRESS_HOST",
    bind_address_port: "BIND_ADDRESS_PORT",
    database_url: "DATABASE_URL",
    auth_host: "AUTH_HOST",
    auth_client_id: "AUTH_CLIENT_ID",
    auth_admin_client_id: "AUTH_ADMIN_CLIENT_ID",
    auth_admin_client_secret: "AUTH_ADMIN_CLIENT_SECRET",
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

    /// The URI of the auth server used to acquire a token.
    pub auth_token_uri: Url,
    /// The `client_id` the backend uses to communicate with the auth server.
    pub auth_admin_client_id: Option<String>,
    /// The `client_secret` the backend uses to communicate with the auth server.
    pub auth_admin_client_secret: Option<Secret<String>>,
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
        let auth_host = env::var(ENV_VARS.auth_host).map_err(|_| env_error(ENV_VARS.auth_host))?;

        let auth_discovery_uri =
            format!("{auth_host}/realms/PermaplanT/.well-known/openid-configuration");
        let auth_token_uri = format!("{auth_host}/realms/master/protocol/openid-connect/token")
            .parse::<Url>()
            .map_err(|e| e.to_string())?;

        let client_id =
            env::var(ENV_VARS.auth_client_id).map_err(|_| env_error(ENV_VARS.auth_client_id))?;

        let auth_admin_client_id = env::var(ENV_VARS.auth_admin_client_id).ok();
        let auth_admin_client_secret = env::var(ENV_VARS.auth_admin_client_secret)
            .map_or_else(|_| None, |client_secret| Some(Secret::new(client_secret)));

        Ok(Self {
            bind_address: (host, port),
            database_url,
            auth_discovery_uri,
            client_id,
            auth_token_uri,
            auth_admin_client_id,
            auth_admin_client_secret,
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
