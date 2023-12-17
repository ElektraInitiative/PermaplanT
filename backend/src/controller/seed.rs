//! `Seed` endpoints.

use actix_web::web::Query;
use actix_web::{
    delete, get, patch, post, put,
    web::{Data, Json, Path},
    HttpResponse, Result,
};
use uuid::Uuid;

use crate::config::auth::user_info::UserInfo;
use crate::config::data::AppDataInner;
use crate::model::dto::actions::Action;
use crate::model::dto::actions::UpdatePlantingAdditionalNamePayload;
use crate::model::dto::{PageParameters, SeedSearchParameters};
use crate::{model::dto::ArchiveSeedDto, model::dto::NewSeedDto, service};

/// Endpoint for fetching all [`SeedDto`](crate::model::dto::SeedDto).
/// If no page parameters are provided, the first page is returned.
/// Seeds are ordered using their use_by date in an ascending fashion.
///
/// By default, archived seeds will not be returned.
/// This behaviour can be changed using `search_parameters`.
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
    let affected_plantings = service::plantings::find_by_seed_id(*id, &app_data);

    for planting in affected_plantings.await? {
        app_data
            .broadcaster
            .broadcast_all_maps(Action::UpdatePlantingAdditionalName(
                UpdatePlantingAdditionalNamePayload::new(
                    &planting,
                    Some(response.name.clone()),
                    user_info.id,
                    Uuid::new_v4(),
                ),
            ))
            .await;
    }

    Ok(HttpResponse::Accepted().json(response))
}

/// Endpoint archiving/unarchiving a [`Seed`](crate::model::entity::Seed).
/// A timestamp will be recorded when the seed is first archived.
///
/// # Errors
/// * If the connection to the database could not be established.
#[patch("/{id}/archive")]
pub async fn archive(
    id: Path<i32>,
    archive_seed_json: Json<ArchiveSeedDto>,
    user_info: UserInfo,
    app_data: Data<AppDataInner>,
) -> Result<HttpResponse> {
    let response =
        service::seed::archive(*id, user_info.id, archive_seed_json.0, &app_data).await?;
    Ok(HttpResponse::Accepted().json(response))
}
