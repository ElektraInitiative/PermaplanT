//! Routes in the backend.

use actix_web::{middleware::NormalizePath, web};

use crate::controller::{plants, seed};

/// Defines all routes of the backend and which functions they map to.
pub fn config(cfg: &mut web::ServiceConfig) {
    cfg.service(
        web::scope("/api")
            .service(
                web::scope("/seeds")
                    .service(seed::find_all)
                    .service(seed::create)
                    .service(seed::delete_by_id)
                    .service(seed::find_by_id),
            )
            .service(
                web::scope("/plants")
                    .service(plants::find)
                    .service(plants::find_by_id),
            )
            .wrap(NormalizePath::default()),
    );
}
