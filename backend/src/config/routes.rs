//! Routes in the backend.

use actix_web::web;

use crate::controllers::{seed_controller, variety_controller};

/// Defines all routes of the backend and which functions they map to.
pub fn config(cfg: &mut web::ServiceConfig) {
    cfg.service(
        web::scope("/api")
            .service(
                web::scope("/seeds")
                    .service(seed_controller::find_all)
                    .service(seed_controller::create)
                    .service(seed_controller::delete_by_id),
            )
            .service(web::scope("/varieties").service(variety_controller::find_all)),
    );
}
