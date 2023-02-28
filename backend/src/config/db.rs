use diesel::{
    pg::PgConnection,
    r2d2::{self, ConnectionManager},
};

pub type Connection = PgConnection;
pub type Pool = r2d2::Pool<ConnectionManager<Connection>>;

pub fn config(url: &str) -> Pool {
    let manager = ConnectionManager::<Connection>::new(url);

    // Panics if the connection to the database could not be established after a certain period of time.
    // Since http calls would fail without a database connection it is irrecoverable.
    #[allow(clippy::expect_used)]
    r2d2::Pool::builder()
        .build(manager)
        .expect("Failed to create pool.")
}