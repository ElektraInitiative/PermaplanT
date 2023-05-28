//! Routes in the backend.

use actix_utils::future::ready;
use actix_web::{middleware::NormalizePath, web};
use actix_web_httpauth::middleware::HttpAuthentication;

use crate::controller::{config, map, plantings, plants, seed, sse};

use super::auth::middleware::validator;

/// Defines all routes of the backend and which functions they map to.
pub fn config(cfg: &mut web::ServiceConfig) {
    let auth = HttpAuthentication::bearer(|req, credentials| ready(validator(req, &credentials)));

    let routes = web::scope("/api")
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
        .wrap(NormalizePath::trim())
        .wrap(auth);

    let sse_route = web::scope("/api/sse").service(sse::sse_client);
    cfg.service(sse_route);

    let config_route = web::scope("/api/config").service(config::get);
    cfg.service(config_route).service(routes);
}
