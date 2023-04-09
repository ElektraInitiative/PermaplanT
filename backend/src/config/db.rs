//! Utilities to set up the initial connection to the database.

use diesel_async::{
    pooled_connection::deadpool, pooled_connection::AsyncDieselConnectionManager, AsyncPgConnection,
};

/// Type renaming of [`deadpool::Pool`] using [`AsyncPgConnection`]
pub type Pool = deadpool::Pool<AsyncPgConnection>;

/// Creates an initialized pool connecting to the database.
///
/// # Panics
/// If the pool is unable to open its minimum number of connections.
#[must_use]
pub fn init_pool(url: &str) -> Pool {
    let manager = AsyncDieselConnectionManager::<AsyncPgConnection>::new(url);

    match deadpool::Pool::builder(manager).build() {
        Ok(pool) => pool,
        Err(e) => panic!("Error while creating pool: {e}"),
    }
}
