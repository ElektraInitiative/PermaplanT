//! Service layer for seeds.

use actix_web::web::Data;
use uuid::Uuid;

use chrono::Utc;

use crate::config::data::AppDataInner;
use crate::model::dto::PageParameters;
use crate::model::dto::{Page, SeedSearchParameters};
use crate::{
    error::ServiceError,
    model::{
        dto::{ArchiveSeedDto, NewSeedDto, SeedDto},
        entity::Seed,
    },
};

/// Search seeds from the database.
/// Seeds are returned in ascending order of their `use_by` dates.
/// If that is not available, the harvest year is used instead.
///
/// By default, archived seeds will not be returned.
/// This behaviour can be changed using `search_parameters`.
///
/// # Errors
/// If the connection to the database could not be established.
pub async fn find(
    search_parameters: SeedSearchParameters,
    page_parameters: PageParameters,
    user_id: Uuid,
    app_data: &Data<AppDataInner>,
) -> Result<Page<SeedDto>, ServiceError> {
    let mut conn = app_data.pool.get().await?;
    let result = Seed::find(search_parameters, user_id, page_parameters, &mut conn).await?;
    Ok(result)
}

/// Find the seed by id from the database.
///
/// # Errors
/// If the connection to the database could not be established.
pub async fn find_by_id(
    id: i32,
    user_id: Uuid,
    app_data: &Data<AppDataInner>,
) -> Result<SeedDto, ServiceError> {
    let mut conn = app_data.pool.get().await?;
    let result = Seed::find_by_id(id, user_id, &mut conn).await?;
    Ok(result)
}

/// Create a new seed in the database.
///
/// # Errors
/// If the connection to the database could not be established.
pub async fn create(
    new_seed: NewSeedDto,
    user_id: Uuid,
    app_data: &Data<AppDataInner>,
) -> Result<SeedDto, ServiceError> {
    let mut conn = app_data.pool.get().await?;
    let result = Seed::create(new_seed, user_id, &mut conn).await?;
    Ok(result)
}

/// Edits a seed in the database.
///
/// # Errors
/// If the connection to the database could not be established.
pub async fn edit(
    id: i32,
    user_id: Uuid,
    new_seed: NewSeedDto,
    app_data: &Data<AppDataInner>,
) -> Result<SeedDto, ServiceError> {
    let mut conn = app_data.pool.get().await?;
    let result = Seed::edit(id, user_id, new_seed, &mut conn).await?;
    Ok(result)
}

/// Delete the seed from the database.
///
/// # Errors
/// If the connection to the database could not be established.
pub async fn delete_by_id(
    id: i32,
    user_id: Uuid,
    app_data: &Data<AppDataInner>,
) -> Result<(), ServiceError> {
    let mut conn = app_data.pool.get().await?;
    let _ = Seed::delete_by_id(id, user_id, &mut conn).await?;
    Ok(())
}

/// Archive or unarchive a seed in the database.
///
/// # Errors
/// If the connection to the database could not be established.
pub async fn archive(
    id: i32,
    user_id: Uuid,
    archive_seed: ArchiveSeedDto,
    app_data: &Data<AppDataInner>,
) -> Result<SeedDto, ServiceError> {
    let mut conn = app_data.pool.get().await?;

    // TODO: don't overwrite old date
    let current_naive_date_time = if archive_seed.archived {
        Some(Utc::now().naive_utc())
    } else {
        None
    };

    let result = Seed::archive(id, current_naive_date_time, user_id, &mut conn).await?;
    Ok(result)
}
