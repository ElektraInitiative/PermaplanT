//! Error of the server and their implementation.

use actix_web::{
    http::{header::ContentType, StatusCode},
    HttpResponse, ResponseError,
};
use derive_more::{Display, Error};
use diesel::result::{DatabaseErrorKind, Error as DieselError};
use diesel_async::pooled_connection::deadpool::PoolError;

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
    /// Creates a new service error containing an [`Http status code`][StatusCode] and a reason for the error.
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

impl From<PoolError> for ServiceError {
    fn from(value: PoolError) -> Self {
        log::error!(
            "Unable to get connection to database: {}",
            value.to_string()
        );
        Self::new(StatusCode::INTERNAL_SERVER_ERROR, value.to_string())
    }
}

impl From<DieselError> for ServiceError {
    fn from(value: DieselError) -> Self {
        let status_code = if value == DieselError::NotFound {
            StatusCode::NOT_FOUND
        } else if let DieselError::DatabaseError(DatabaseErrorKind::UniqueViolation, _) = value {
            StatusCode::CONFLICT
        } else if let DieselError::DatabaseError(DatabaseErrorKind::CheckViolation, _) = value {
            StatusCode::BAD_REQUEST
        } else if let DieselError::DatabaseError(DatabaseErrorKind::ForeignKeyViolation, _) = value
        {
            StatusCode::CONFLICT
        } else if let DieselError::DatabaseError(DatabaseErrorKind::NotNullViolation, _) = value {
            StatusCode::BAD_REQUEST
        } else {
            log::error!("Error executing diesel SQL query: {}", value.to_string());
            StatusCode::INTERNAL_SERVER_ERROR
        };

        Self::new(status_code, value.to_string())
    }
}
