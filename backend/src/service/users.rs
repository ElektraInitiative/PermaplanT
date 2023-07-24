//! Service layer for user data.

use actix_web::web::Data;
use uuid::Uuid;

use crate::{
    config::data::AppDataInner,
    error::ServiceError,
    model::{dto::UsersDto, entity::Users},
};

/// Create a user data entry for a new user.
///
/// # Errors
/// If the connection to the database could not be established.
pub async fn create(
    user_id: Uuid,
    user_data: UsersDto,
    app_data: &Data<AppDataInner>,
) -> Result<UsersDto, ServiceError> {
    let mut conn = app_data.pool.get().await?;
    let result = Users::create(user_data, user_id, &mut conn).await?;
    Ok(result)
}
