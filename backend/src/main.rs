#![recursion_limit = "256"]
#![deny(clippy::unwrap_used, clippy::expect_used)]

use dotenvy::dotenv;

pub mod config;
pub mod constants;
pub mod controllers;
pub mod error;
pub mod models;
pub mod schema;
pub mod server;
pub mod services;

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    dotenv().ok();

    let config = match config::app::Config::from_env() {
        Ok(config) => config,
        Err(e) => panic!("Error reading configuration: {e}"),
    };

    server::start(config).await
}
