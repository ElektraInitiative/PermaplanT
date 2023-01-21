use actix_web::web;

use crate::controllers;

pub fn config(cfg: &mut web::ServiceConfig) {
    cfg.service(web::scope("/api").service(web::scope("/seeds").service(
        web::resource("").route(web::post().to(controllers::seed_controller::create_seed)),
    )));
}
