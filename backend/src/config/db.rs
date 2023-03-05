//! Utilities to set up the initial connection to the database.

use diesel::{
    pg::PgConnection,
    r2d2::{self, ConnectionManager},
};

/// Type renaming of [`r2d2::Pool`] using [`ConnectionManager`]
pub type Pool = r2d2::Pool<ConnectionManager<PgConnection>>;

/// Creates an initialized pool connecting to the database.
///
/// # Panics
/// If the pool is unable to open its minimum number of connections.
#[must_use]
pub fn init_pool(url: &str) -> Pool {
    let manager = ConnectionManager::<PgConnection>::new(url);

    match r2d2::Pool::builder().build(manager) {
        Ok(pool) => pool,
        Err(e) => panic!("Error while creating pool: {e}"),
    }
}
