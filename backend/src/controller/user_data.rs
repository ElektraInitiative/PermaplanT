//! `UserData` endpoints.

use actix_web::{
    get, post,
    web::{Data, Json},
    HttpResponse, Result,
};

use crate::{
    config::{auth::user_info::UserInfo, data::AppDataInner},
    model::dto::UserDataDto,
    service,
};

/// Endpoint for fetching a [`GuidedToursDto`](crate::model::dto::GuidedToursDto).
///
/// # Errors
/// * If the connection to the database could not be established.
#[utoipa::path(
    context_path = "/api/users",
    responses(
        (status = 200, description = "Fetch guided tours status by user", body = GuidedToursDto)
    ),
    security(
        ("oauth2" = [])
    )
)]
#[get("/tours")]
pub async fn guided_tours(
    user_info: UserInfo,
    app_data: Data<AppDataInner>,
) -> Result<HttpResponse> {
    let response = service::user_data::guided_tours(user_info.id, &app_data).await?;
    Ok(HttpResponse::Ok().json(response))
}

/// Endpoint for creating an [`UserData`](crate::model::entity::UserData) entry.
///
/// # Errors
/// * If the connection to the database could not be established.
#[utoipa::path(
    context_path = "/api/users",
    responses(
        (status = 201, description = "Create user data entry for new user", body = UserDataDto)
    ),
    security(
        ("oauth2" = [])
    )
)]
#[post("")]
pub async fn create(
    user_info: UserInfo,
    user_data_json: Json<UserDataDto>,
    app_data: Data<AppDataInner>,
) -> Result<HttpResponse> {
    let response = service::user_data::create(user_info.id, user_data_json.0, &app_data).await?;
    Ok(HttpResponse::Created().json(response))
}
