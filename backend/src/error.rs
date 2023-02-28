use actix_web::{
    http::{header::ContentType, StatusCode},
    HttpResponse, ResponseError,
};
use derive_more::{Display, Error};

#[derive(Debug, Display, Error)]
#[display(fmt = "{status_code}: {reason}")]
pub struct ServiceError {
    pub status_code: StatusCode,
    pub reason: String,
}

impl ServiceError {
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
