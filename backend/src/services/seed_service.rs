use actix_web::web::Data;

use crate::{config::db::Pool, models::seed::Seed};

pub fn create(pool: &Data<Pool>) -> Seed {
    Seed::create(&mut pool.get().unwrap(), "title", "body")
}
