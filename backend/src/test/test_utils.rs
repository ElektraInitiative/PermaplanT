//! Test utilities

#![cfg(test)]

use actix_web::web::Data;

use diesel::prelude::*;

use diesel::{
    r2d2::{self, ConnectionManager, CustomizeConnection, PooledConnection},
    PgConnection,
};
use dotenvy::dotenv;

use crate::config::app;
use crate::config::db::Pool;
use crate::error::ServiceError;

#[derive(Debug)]
struct TestTransaction;

impl CustomizeConnection<PgConnection, r2d2::Error> for TestTransaction {
    fn on_acquire(&self, conn: &mut PgConnection) -> ::std::result::Result<(), r2d2::Error> {
        conn.begin_test_transaction()
            .expect("Failed to begin test transaction");

        Ok(())
    }
}

/// Initializes a test database with the given initializer function.
///
/// Using this function and the returned pool, has the limitation that the test should only call exactly one controller
/// method.
/// Because the test transaction is started by the controller and is never committed, the different controller methods
/// can not see each other's changes.
pub fn init_test_database<F>(mut initializer_fn: F) -> Data<Pool>
where
    F: FnMut(PooledConnection<ConnectionManager<PgConnection>>) -> Result<(), ServiceError>,
{
    dotenv().ok();

    let app_config = app::Config::from_env().expect("Error loading configuration");
    let manager = ConnectionManager::<PgConnection>::new(&app_config.database_url);
    let pool = Pool::builder()
        .connection_customizer(Box::new(TestTransaction))
        .build(manager)
        .expect("Failed to init pool");

    let conn = pool.get().expect("Failed to get connection from pool");

    initializer_fn(conn).expect("Failed to initialize test database");

    Data::new(pool.clone())
}
