//! `Users` endpoints.

use actix_web::{
    get, post,
    web::{Json, Query},
    HttpResponse, Result,
};

use crate::{
    config::{
        auth::user_info::UserInfo,
        data::{SharedHttpClient, SharedKeycloakApi, SharedPool},
    },
    model::dto::{UserSearchParameters, UsersDto},
    service,
};

/// Endpoint for searching users.
///
/// # Errors
/// * If the connection to the keycloak API could not be established.
#[utoipa::path(
    context_path = "/api/users",
    params(
        UserSearchParameters,
    ),
    responses(
        (status = 200, description = "Users matching the username search", body = Vec<UserDto>)
    ),
    security(
        ("oauth2" = [])
    )
)]
#[get("")]
pub async fn find(
    search_query: Query<UserSearchParameters>,
    keycloak_api: SharedKeycloakApi,
    http_client: SharedHttpClient,
) -> Result<HttpResponse> {
    let response =
        service::users::search_by_username(&search_query.username, &keycloak_api, &http_client)
            .await?;
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
    pool: SharedPool,
) -> Result<HttpResponse> {
    let response = service::users::create(user_info.id, user_data_json.0, &pool).await?;
    Ok(HttpResponse::Created().json(response))
}
