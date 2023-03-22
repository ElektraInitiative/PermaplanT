//! Routes in the backend.

use actix_web::web;

use crate::controller::{map, plants, seed};

/// Defines all routes of the backend and which functions they map to.
pub fn config(cfg: &mut web::ServiceConfig) {
    cfg.service(
        web::scope("/api")
            .service(
                web::scope("/seeds")
                    .service(seed::find_all)
                    .service(seed::create)
                    .service(seed::delete_by_id),
            )
            .service(web::scope("/plants").service(plants::find_all))
            .service(
                web::scope("/maps")
                    .service(map::find_all)
                    .service(map::find_by_id)
                    .service(map::update_by_id),
            ),
    );
}
