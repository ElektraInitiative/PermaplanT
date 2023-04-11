//! Service layer for seeds.

use actix_web::web::Data;

use crate::{
    db::connection::Pool,
    error::ServiceError,
    model::{
        dto::{NewSeedDto, SeedDto},
        entity::Seed,
    },
};

/// Fetch all seeds from the database.
///
/// # Errors
/// If the connection to the database could not be established.
pub async fn find_all(pool: &Data<Pool>) -> Result<Vec<SeedDto>, ServiceError> {
    let mut conn = pool.get().await?;
    let result = Seed::find_all(&mut conn).await?;
    Ok(result)
}

/// Find the seed by id from the database.
///
/// # Errors
/// If the connection to the database could not be established.
pub async fn find_by_id(id: i32, pool: &Data<Pool>) -> Result<SeedDto, ServiceError> {
    let mut conn = pool.get().await?;
    let result = Seed::find_by_id(id, &mut conn).await?;
    Ok(result)
}

/// Create a new seed in the database.
///
/// # Errors
/// If the connection to the database could not be established.
pub async fn create(new_seed: NewSeedDto, pool: &Data<Pool>) -> Result<SeedDto, ServiceError> {
    let mut conn = pool.get().await?;
    let result = Seed::create(new_seed, &mut conn).await?;
    Ok(result)
}

/// Delete the seed from the database.
///
/// # Errors
/// If the connection to the database could not be established.
pub async fn delete_by_id(id: i32, pool: &Data<Pool>) -> Result<(), ServiceError> {
    let mut conn = pool.get().await?;
    let _ = Seed::delete_by_id(id, &mut conn).await?;
    Ok(())
}
