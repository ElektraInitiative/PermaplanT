//! Service layer for seeds.

use actix_web::web::Data;

use crate::config::data::AppDataInner;
use crate::model::dto::PageParameters;
use crate::model::dto::{Page, SeedSearchParameters};
use crate::{
    error::ServiceError,
    model::{
        dto::{NewSeedDto, SeedDto},
        entity::Seed,
    },
};

/// Search seeds from the database.
///
/// # Errors
/// If the connection to the database could not be established.
pub async fn find(
    search_parameters: SeedSearchParameters,
    page_parameters: PageParameters,
    app_data: &Data<AppDataInner>,
) -> Result<Page<SeedDto>, ServiceError> {
    let mut conn = app_data.pool.get().await?;
    let result = Seed::find(search_parameters, page_parameters, &mut conn).await?;
    Ok(result)
}

/// Find the seed by id from the database.
///
/// # Errors
/// If the connection to the database could not be established.
pub async fn find_by_id(id: i32, app_data: &Data<AppDataInner>) -> Result<SeedDto, ServiceError> {
    let mut conn = app_data.pool.get().await?;
    let result = Seed::find_by_id(id, &mut conn).await?;
    Ok(result)
}

/// Create a new seed in the database.
///
/// # Errors
/// If the connection to the database could not be established.
pub async fn create(
    new_seed: NewSeedDto,
    app_data: &Data<AppDataInner>,
) -> Result<SeedDto, ServiceError> {
    let mut conn = app_data.pool.get().await?;
    let result = Seed::create(new_seed, &mut conn).await?;
    Ok(result)
}

/// Delete the seed from the database.
///
/// # Errors
/// If the connection to the database could not be established.
pub async fn delete_by_id(id: i32, app_data: &Data<AppDataInner>) -> Result<(), ServiceError> {
    let mut conn = app_data.pool.get().await?;
    let _ = Seed::delete_by_id(id, &mut conn).await?;
    Ok(())
}
