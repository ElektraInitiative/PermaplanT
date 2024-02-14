//! Keycloak API errors

use std::{
    error::Error,
    fmt::{self, Display, Formatter},
};

#[derive(Debug, Clone)]
pub enum KeycloakApiError {
    Reqwest(String),
    Other(String),
}

impl Display for KeycloakApiError {
    fn fmt(&self, f: &mut Formatter<'_>) -> fmt::Result {
        match self {
            Self::Reqwest(err) => write!(f, "Reqwest error: {err}"),
            Self::Other(err) => write!(f, "Other error: {err}"),
        }
    }
}

impl Error for KeycloakApiError {}

impl From<reqwest::Error> for KeycloakApiError {
    fn from(err: reqwest::Error) -> Self {
        Self::Reqwest(err.to_string())
    }
}

impl From<url::ParseError> for KeycloakApiError {
    fn from(err: url::ParseError) -> Self {
        Self::Other(err.to_string())
    }
}

impl From<actix_http::header::InvalidHeaderValue> for KeycloakApiError {
    fn from(err: actix_http::header::InvalidHeaderValue) -> Self {
        Self::Other(err.to_string())
    }
}

impl From<serde_json::Error> for KeycloakApiError {
    fn from(err: serde_json::Error) -> Self {
        Self::Other(err.to_string())
    }
}
