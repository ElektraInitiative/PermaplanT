//! `Seed` endpoints.

use actix_web::web::Query;
use actix_web::{
    delete, get, post, put,
    web::{Data, Json, Path},
    HttpResponse, Result,
};

use crate::config::auth::user_info::UserInfo;
use crate::config::data::AppDataInner;
use crate::model::dto::{PageParameters, SeedSearchParameters};
use crate::{model::dto::NewSeedDto, service};

/// Endpoint for fetching all [`SeedDto`](crate::model::dto::SeedDto).
/// If no page parameters are provided, the first page is returned.
/// Seeds are ordered using their use_by date in an ascending fashion.
///
/// # Errors
/// * If the connection to the database could not be established.
#[utoipa::path(
    context_path = "/api/seeds",
    params(
        SeedSearchParameters,
        PageParameters
    ),
    responses(
        (status = 200, description = "Fetch all seeds", body = PageSeedDto)
    ),
    security(
        ("oauth2" = [])
    )
)]
#[get("")]
pub async fn find(
    search_query: Query<SeedSearchParameters>,
    page_query: Query<PageParameters>,
    app_data: Data<AppDataInner>,
    user_info: UserInfo,
) -> Result<HttpResponse> {
    let response = service::seed::find(
        search_query.into_inner(),
        page_query.into_inner(),
        user_info.id,
        &app_data,
    )
    .await?;
    Ok(HttpResponse::Ok().json(response))
}

/// Endpoint for fetching a [`Seed`](crate::model::entity::Seed).
///
/// # Errors
/// * If the connection to the database could not be established.
#[utoipa::path(
    context_path = "/api/seeds",
    responses(
        (status = 200, description = "Fetch seed by id", body = SeedDto)
    ),
    security(
        ("oauth2" = [])
    )
)]
#[get("/{id}")]
pub async fn find_by_id(
    id: Path<i32>,
    app_data: Data<AppDataInner>,
    user_info: UserInfo,
) -> Result<HttpResponse> {
    let response = service::seed::find_by_id(*id, user_info.id, &app_data).await?;
    Ok(HttpResponse::Ok().json(response))
}

/// Endpoint for creating a new [`Seed`](crate::model::entity::Seed).
///
/// # Errors
/// * If the connection to the database could not be established.
#[utoipa::path(
    context_path = "/api/seeds",
    request_body = NewSeedDto,
    responses(
        (status = 201, description = "Create a seed", body = SeedDto)
    ),
    security(
        ("oauth2" = [])
    )
)]
#[post("")]
pub async fn create(
    new_seed_json: Json<NewSeedDto>,
    app_data: Data<AppDataInner>,
    user_info: UserInfo,
) -> Result<HttpResponse> {
    let response = service::seed::create(new_seed_json.0, user_info.id, &app_data).await?;
    Ok(HttpResponse::Created().json(response))
}

/// Endpoint for deleting a [`Seed`](crate::model::entity::Seed).
///
/// # Errors
/// * If the connection to the database could not be established.
#[utoipa::path(
    context_path = "/api/seeds",
    responses(
        (status = 200, description = "Delete a seed", body = String)
    ),
    security(
        ("oauth2" = [])
    )
)]
#[delete("/{id}")]
pub async fn delete_by_id(
    path: Path<i32>,
    app_data: Data<AppDataInner>,
    user_info: UserInfo,
) -> Result<HttpResponse> {
    service::seed::delete_by_id(*path, user_info.id, &app_data).await?;
    Ok(HttpResponse::Ok().json(""))
}

/// Endpoint for editing a [`Seed`](crate::model::entity::Seed).
///
/// # Errors
/// * If the connection to the database could not be established.
#[put("/{id}")]
pub async fn edit_by_id(
    id: Path<i32>,
    edit_seed_json: Json<NewSeedDto>,
    user_info: UserInfo,
    app_data: Data<AppDataInner>,
) -> Result<HttpResponse> {
    let response = service::seed::edit(*id, user_info.id, edit_seed_json.0, &app_data).await?;
    Ok(HttpResponse::Accepted().json(response))
}
