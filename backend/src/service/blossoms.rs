//! Service layer for blossoms.

use uuid::Uuid;

use crate::{
    config::data::SharedPool,
    error::ServiceError,
    model::{dto::GainedBlossomsDto, entity::GainedBlossoms},
};

/// The user gains the specified Blossom.
///
/// # Errors
/// If the connection to the database could not be established.
pub async fn gain(
    gained_blossom: GainedBlossomsDto,
    user_id: Uuid,
    pool: &SharedPool,
) -> Result<GainedBlossomsDto, ServiceError> {
    let mut conn = pool.get().await?;
    let result = GainedBlossoms::create(gained_blossom, user_id, &mut conn).await?;
    Ok(result)
}
