//! Error of the server and their implementation.

use actix_web::{
    http::{header::ContentType, StatusCode},
    HttpResponse, ResponseError,
};
use derive_more::{Display, Error};

/// The default error used by the server.
#[derive(Debug, Display, Error)]
#[display(fmt = "{status_code}: {reason}")]
#[allow(clippy::module_name_repetitions)] // Error structs need to be easily recognizable.
pub struct ServiceError {
    /// The status code to be used for the response.
    pub status_code: StatusCode,
    /// The reason for the error.
    pub reason: String,
}

impl ServiceError {
    /// Creates a new service errro containing an [`Http status code`][StatusCode] and a reason for the error.
    #[must_use]
    pub const fn new(status_code: StatusCode, reason: String) -> Self {
        Self {
            status_code,
            reason,
        }
    }
}

impl ResponseError for ServiceError {
    fn status_code(&self) -> StatusCode {
        self.status_code
    }

    fn error_response(&self) -> HttpResponse {
        HttpResponse::build(self.status_code())
            .insert_header(ContentType::plaintext())
            .body(self.reason.clone())
    }
}

impl From<diesel::r2d2::PoolError> for ServiceError {
    fn from(value: diesel::r2d2::PoolError) -> Self {
        Self::new(StatusCode::INTERNAL_SERVER_ERROR, value.to_string())
    }
}

impl From<diesel::result::Error> for ServiceError {
    fn from(value: diesel::result::Error) -> Self {
        Self::new(StatusCode::INTERNAL_SERVER_ERROR, value.to_string())
    }
}
