use std::env;

use crate::config::db;
use crate::config::routes;
use crate::config::server::Config;
use actix_web::web::Data;
use actix_web::{App, HttpServer};
use dotenvy::dotenv;

pub async fn start(config: Config) -> std::io::Result<()> {
    dotenv().ok();

    let database_url = env::var("DATABASE_URL").expect("DATABASE_URL must be set");
    let pool = db::config(&database_url);
    let pool = Data::new(pool.clone());

    HttpServer::new(move || {
        App::new()
            .configure(routes::config)
            .app_data(Data::clone(&pool))
    })
    .bind(config.bind_address)?
    .run()
    .await
}
