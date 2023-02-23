use diesel::{
    pg::PgConnection,
    r2d2::{self, ConnectionManager},
};

pub type Connection = PgConnection;
pub type Pool = r2d2::Pool<ConnectionManager<Connection>>;

#[allow(clippy::expect_used)]
pub fn config(url: &str) -> Pool {
    let manager = ConnectionManager::<Connection>::new(url);
    let pool = r2d2::Pool::builder()
        .build(manager)
        .expect("Failed to create pool.");
    pool
}
