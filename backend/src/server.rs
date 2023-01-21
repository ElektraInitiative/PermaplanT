use crate::config::app::Config;
use crate::config::db;
use crate::config::routes;
use actix_web::web::Data;
use actix_web::{App, HttpServer};
use dotenvy::dotenv;

pub async fn start(app_config: Config) -> std::io::Result<()> {
    dotenv().ok();

    let pool = db::config(&app_config.database_url);
    let pool = Data::new(pool.clone());

    HttpServer::new(move || {
        App::new()
            .app_data(Data::clone(&pool))
            .configure(routes::config)
    })
    .bind(app_config.bind_address)?
    .run()
    .await
}
