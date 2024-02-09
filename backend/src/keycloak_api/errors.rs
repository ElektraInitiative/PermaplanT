//! Keycloak API errors

use std::{
    error::Error,
    fmt::{self, Display, Formatter},
};

use oauth2::ErrorResponse;

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

impl From<oauth2::url::ParseError> for KeycloakApiError {
    fn from(err: oauth2::url::ParseError) -> Self {
        Self::Other(err.to_string())
    }
}

impl From<actix_http::header::InvalidHeaderValue> for KeycloakApiError {
    fn from(err: actix_http::header::InvalidHeaderValue) -> Self {
        Self::Other(err.to_string())
    }
}

impl<RE, T> From<oauth2::RequestTokenError<RE, T>> for KeycloakApiError
where
    RE: Error,
    T: ErrorResponse,
{
    fn from(value: oauth2::RequestTokenError<RE, T>) -> Self {
        Self::Other(value.to_string())
    }
}
