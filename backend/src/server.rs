use crate::config::app::Config;
use crate::config::db;
use crate::config::routes;
use actix_cors::Cors;
use actix_web::http;
use actix_web::web::Data;
use actix_web::{App, HttpServer};
use dotenvy::dotenv;

pub async fn start(app_config: Config) -> std::io::Result<()> {
    dotenv().ok();

    let pool = db::config(&app_config.database_url);
    let pool = Data::new(pool.clone());

    HttpServer::new(move || {
        App::new()
            .wrap(
                Cors::default() // allowed_origin return access-control-allow-origin: * by default
                    .allowed_origin("http://127.0.0.1:5173")
                    .allowed_origin("http://localhost:5173")
                    .send_wildcard()
                    .allowed_methods(vec!["GET", "POST", "PUT", "DELETE"])
                    .allowed_header(http::header::CONTENT_TYPE)
                    .max_age(3600),
            )
            .app_data(Data::clone(&pool))
            .configure(routes::config)
    })
    .bind(app_config.bind_address)?
    .run()
    .await
}
