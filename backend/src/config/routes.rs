use actix_web::web;

use crate::controllers;

pub fn config(cfg: &mut web::ServiceConfig) {
    cfg.service(
        web::scope("/api")
            .service(
                web::scope("/seeds")
                    .route("", web::post().to(controllers::seed_controller::create))
                    .route(
                        "/{id}",
                        web::delete().to(controllers::seed_controller::delete_by_id),
                    )
                    .route("", web::get().to(controllers::seed_controller::find_all)),
            )
            .service(
                web::scope("/varieties")
                    .route("", web::get().to(controllers::variety_controller::find_all)),
            ),
    );
}
