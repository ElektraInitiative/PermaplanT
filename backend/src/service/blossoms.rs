//! Service layer for blossoms.

use actix_web::web::Data;
use uuid::Uuid;

use crate::{
    config::data::AppDataInner,
    error::ServiceError,
    model::{dto::BlossomsGainedDto, entity::BlossomsGained},
};

/// The user gains the specified Blossom.
///
/// # Errors
/// If the connection to the database could not be established.
pub async fn gain(
    gained_blossom: BlossomsGainedDto,
    user_id: Uuid,
    app_data: &Data<AppDataInner>,
) -> Result<BlossomsGainedDto, ServiceError> {
    let mut conn = app_data.pool.get().await?;
    let result = BlossomsGained::create(gained_blossom, user_id, &mut conn).await?;
    Ok(result)
}
