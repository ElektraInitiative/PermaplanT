//! Scheduled tasks for the database.

use crate::db::connection::Pool;
use chrono::{Days, Utc};
use diesel::{debug_query, pg::Pg, QueryDsl};
use diesel::{BoolExpressionMethods, ExpressionMethods};
use diesel_async::RunQueryDsl;
use log::debug;
use std::sync::Arc;
use std::time::Duration;

use crate::schema::maps;

/// How often the deleted maps are cleaned up in seconds.
const CLEANUP_MAPS_INTERVAL: u64 = 60 * 60 * 24;

/// Permanently remove deleted maps older than 30 days from the database.
/// Runs every [`CLEANUP_MAPS_INTERVAL`] seconds.
pub async fn cleanup_maps(pool: Arc<Pool>) -> ! {
    loop {
        tokio::time::sleep(Duration::from_secs(CLEANUP_MAPS_INTERVAL)).await;

        log::info!("Running maps cleanup...");

        let Some(one_month_ago) = Utc::now().date_naive().checked_sub_days(Days::new(30)) else {
            log::error!("Failed to calculate date one month ago");
            continue;
        };
        let query = diesel::delete(
            maps::table.filter(
                maps::deletion_date
                    .is_not_null()
                    .and(maps::deletion_date.lt(one_month_ago)),
            ),
        );
        debug!("{}", debug_query::<Pg, _>(&query));

        match pool.get().await {
            Ok(mut conn) => match query.execute(&mut conn).await {
                Ok(delete_rows) => log::info!("Removed {delete_rows} maps"),
                Err(e) => log::error!("Failed to execute query: {}", e),
            },
            Err(e) => {
                log::error!("Failed to get connection from pool: {}", e);
            }
        }
    }
}
