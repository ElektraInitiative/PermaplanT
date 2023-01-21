use actix_web::web;

use crate::controllers;

pub fn config(cfg: &mut web::ServiceConfig) {
    cfg.service(
        web::resource("/seeds").route(web::post().to(controllers::seed_controller::create_seed)),
    );
}
