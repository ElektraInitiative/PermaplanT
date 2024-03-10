//! Configurations for the app data that is available to all controllers.

use crate::sse::broadcaster::Broadcaster;
use actix_web::web::Data;

use lib_db::db::connection;

/// Data available to all controllers.
pub struct AppDataInner {
    /// Connection pool to the database.
    pub pool: connection::Pool,
    /// Server-Sent Events broadcaster.
    pub broadcaster: Broadcaster,
}

/// Initializes the app data that is available to all controllers.
///
/// # Panics
/// If the database pool can not be initialized.
#[must_use]
pub fn init(database_url: &str) -> Data<AppDataInner> {
    let pool = connection::init_pool(database_url);
    let broadcaster = Broadcaster::new();

    Data::new(AppDataInner { pool, broadcaster })
}
