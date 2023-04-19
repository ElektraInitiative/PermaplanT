//! Test utilities

#![cfg(test)]

use actix_web::web::Data;

use diesel_async::pooled_connection::AsyncDieselConnectionManager;
use diesel_async::scoped_futures::ScopedBoxFuture;
use diesel_async::{AsyncConnection, AsyncPgConnection};
use dotenvy::dotenv;

use crate::config::app;
use crate::db::connection::Pool;
use crate::error::ServiceError;

// TODO: Think about test_transactions

/// Initializes a test database with the given initializer function.
///
/// Using this function and the returned pool, has the limitation that the test should only call exactly one controller
/// method.
/// Because the test transaction is started by the controller and is never committed, the different controller methods
/// can not see each other's changes.
pub async fn init_test_database<'a, F>(initializer_fn: F) -> Data<Pool>
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
    let pool = Pool::builder(manager).build().expect("Failed to init pool");

    let mut conn = pool
        .get()
        .await
        .expect("Failed to get connection from pool");

    conn.begin_test_transaction()
        .await
        .expect("Failed to begin test transaction");

    conn.transaction(|conn| initializer_fn(conn))
        .await
        .expect("Failed to initialize test database");

    Data::new(pool.clone())
}
