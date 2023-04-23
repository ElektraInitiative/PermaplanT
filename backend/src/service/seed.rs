//! Service layer for seeds.

use actix_web::web::Data;

use crate::model::dto::PageParameters;
use crate::model::dto::{Page, SeedSearchParameters};
use crate::{
    db::connection::Pool,
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
    pool: &Data<Pool>,
) -> Result<Page<SeedDto>, ServiceError> {
    let mut conn = pool.get().await?;
    let result = Seed::find(search_parameters, page_parameters, &mut conn).await?;
    let result = Page::from_entity(result);
    Ok(result)
}

/// Find the seed by id from the database.
///
/// # Errors
/// If the connection to the database could not be established.
pub async fn find_by_id(id: i32, pool: &Data<Pool>) -> Result<SeedDto, ServiceError> {
    let mut conn = pool.get().await?;
    let result = Seed::find_by_id(id, &mut conn).await?.into();
    Ok(result)
}

/// Create a new seed in the database.
///
/// # Errors
/// If the connection to the database could not be established.
pub async fn create(new_seed: NewSeedDto, pool: &Data<Pool>) -> Result<SeedDto, ServiceError> {
    let mut conn = pool.get().await?;
    let result = Seed::create(new_seed.into(), &mut conn).await?.into();
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
