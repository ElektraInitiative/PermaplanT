//! Routes in the backend.

use actix_web::{middleware::NormalizePath, web};

use crate::controller::{base_layers, map, plantings, plants, seed};

/// Defines all routes of the backend and which functions they map to.
pub fn config(cfg: &mut web::ServiceConfig) {
    cfg.service(
        web::scope("/api")
            .service(
                web::scope("/seeds")
                    .service(seed::find)
                    .service(seed::create)
                    .service(seed::delete_by_id)
                    .service(seed::find_by_id),
            )
            .service(
                web::scope("/plants")
                    .service(plants::find)
                    .service(plants::find_by_id),
            )
            .service(
                web::scope("/base_layers")
                    .service(base_layers::find_by_id)
                    .service(base_layers::create),
            )
            .service(
                web::scope("/maps")
                    .service(map::find)
                    .service(map::find_by_id)
                    .service(map::create)
                    .service(map::show_versions)
                    .service(map::save_snapshot),
            )
            .service(
                web::scope("/plantings")
                    .service(plantings::find)
                    .service(plantings::create)
                    .service(plantings::update)
                    .service(plantings::delete),
            )
            .wrap(NormalizePath::default()),
    );
}
