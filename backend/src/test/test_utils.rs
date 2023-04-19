//! Test utilities

#![cfg(test)]

use actix_http::Request;
use actix_web::body::MessageBody;
use actix_web::dev::{Service, ServiceResponse};
use actix_web::web::Data;
use actix_web::{test, App, Error};
use diesel_async::pooled_connection::AsyncDieselConnectionManager;
use diesel_async::scoped_futures::ScopedBoxFuture;
use diesel_async::{AsyncConnection, AsyncPgConnection};
use dotenvy::dotenv;

use crate::config::{app, routes};
use crate::db::connection::Pool;
use crate::error::ServiceError;

/// Initializes a test database with the given initializer function.
///
/// All transactions are run inside [`AsyncConnection::begin_test_transaction`]
pub async fn init_test_app<'a, F>(
    init_database: F,
) -> impl Service<Request, Response = ServiceResponse<impl MessageBody>, Error = Error>
where
    F: for<'r> FnOnce(
            &'r mut AsyncPgConnection,
        ) -> ScopedBoxFuture<'a, 'r, Result<(), ServiceError>>
        + Send
        + 'a,
{
    dotenv().ok();
    let app_config = app::Config::from_env().expect("Error loading configuration");

    let manager = AsyncDieselConnectionManager::<AsyncPgConnection>::new(app_config.database_url);
    let pool = Pool::builder(manager)
        .max_size(1) // allow only one connection (which is the test transaction)
        .build()
        .expect("Failed to init pool");

    let mut conn = pool
        .get()
        .await
        .expect("Failed to get connection from pool");

    conn.begin_test_transaction()
        .await
        .expect("Failed to begin test transaction");

    conn.transaction(|conn| init_database(conn))
        .await
        .expect("Failed to initialize test database");

    test::init_service(
        App::new()
            .app_data(Data::new(pool))
            .configure(routes::config),
    )
    .await
}
