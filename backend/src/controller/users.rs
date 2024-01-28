//! `Users` endpoints.

use actix_web::{
    get, post,
    web::{Data, Json},
    HttpResponse, Result,
};

use crate::{
    config::{auth::user_info::UserInfo, data::AppDataInner},
    model::dto::UsersDto,
    service,
};

/// Endpoint for getting users.
#[utoipa::path(
    context_path = "/api/users",
    responses(
        (status = 200, description = "Find users", body = Vec<UserDto>)
    ),
    security(
        ("oauth2" = [])
    )
)]
#[get("")]
pub async fn find(app_data: Data<AppDataInner>) -> Result<HttpResponse> {
    let response = service::users::find(&app_data).await?;
    Ok(HttpResponse::Ok().json(response))
}

/// Endpoint for creating an [`Users`](crate::model::entity::Users) entry.
///
/// # Errors
/// * If the connection to the database could not be established.
#[utoipa::path(
    context_path = "/api/users",
    responses(
        (status = 201, description = "Create user data entry for new user", body = UsersDto)
    ),
    security(
        ("oauth2" = [])
    )
)]
#[post("")]
pub async fn create(
    user_info: UserInfo,
    user_data_json: Json<UsersDto>,
    app_data: Data<AppDataInner>,
) -> Result<HttpResponse> {
    let response = service::users::create(user_info.id, user_data_json.0, &app_data).await?;
    Ok(HttpResponse::Created().json(response))
}
