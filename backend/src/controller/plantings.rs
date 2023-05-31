//! `Planting` endpoints.

// As this is just an api draft at this stage there are several clippy errors that
// need to be ignored for the CI to accept this.
// FIXME:
//  Remove these clippy allows when these endpoints are full implemented.

use actix_web::web::Query;
use actix_web::{
    delete, get, patch, post,
    web::{Data, Json, Path},
    HttpResponse, Result,
};
use uuid::Uuid;

use crate::config::auth::user_info::{self, UserInfo};
use crate::model::dto::actions::{CreatePlantActionDto, DeletePlantActionDto};
use crate::model::dto::{
    NewPlantingDto, Page, PageParameters, PlantLayerObjectDto, PlantingSearchParameters,
    UpdatePlantingDto,
};
use crate::AppDataInner;

/// Endpoint for listing and filtering `Planting`.
/// If no page parameters are provided, the first page is returned.
///
/// # Errors
/// * If the connection to the database could not be established.
#[allow(unused_variables)]
#[allow(clippy::unused_async)]
#[utoipa::path(
    context_path = "/api/plantings",
    params(
        PlantingSearchParameters,
        PageParameters
    ),
    responses(
        (status = 200, description = "Find plantings", body = PagePlantingDto)
    ),
    security(
        ("oauth2" = [])
    )
)]
#[get("")]
pub async fn find(
    search_query: Query<PlantingSearchParameters>,
    page_query: Query<PageParameters>,
    app_data: Data<AppDataInner>,
) -> Result<HttpResponse> {
    // TODO: implement service that validates (permission, integrity) and filters for records.
    let page = Page {
        results: vec![PlantLayerObjectDto {
            id: "uuid".to_string(),
            plant_id: 1,
            x: 0,
            y: 0,
            height: 100,
            width: 100,
            rotation: 0,
            scale_x: 1,
            scale_y: 1,
        }],
        page: 1,
        per_page: 10,
        total_pages: 1,
    };
    Ok(HttpResponse::Ok().json(page))
}

/// Endpoint for creating a new `Planting`.
///
/// # Errors
/// * If the connection to the database could not be established.
#[allow(unused_variables)]
#[allow(clippy::unused_async)]
#[utoipa::path(
    context_path = "/api/plantings",
    request_body = NewPlantingDto,
    responses(
        (status = 201, description = "Create a planting", body = PlantingDto)
    ),
    security(
        ("oauth2" = [])
    )
)]
#[post("")]
pub async fn create(
    new_plant_json: Json<NewPlantingDto>,
    app_data: Data<AppDataInner>,
    user_info: UserInfo,
) -> Result<HttpResponse> {
    // TODO: implement service that validates (permission, integrity) and creates the record.
    let dto = PlantLayerObjectDto {
        id: new_plant_json.id.to_string(),
        plant_id: new_plant_json.plant_id,
        x: new_plant_json.x,
        y: new_plant_json.y,
        height: new_plant_json.height,
        width: new_plant_json.width,
        rotation: new_plant_json.rotation,
        scale_x: new_plant_json.scale_x,
        scale_y: new_plant_json.scale_y,
    };

    app_data
        .broadcaster
        .broadcast(&CreatePlantActionDto::new(dto.clone(), user_info.id.to_string()).to_string())
        .await;

    Ok(HttpResponse::Created().json(dto))
}

/// Endpoint for updating a `Planting`.
///
/// # Errors
/// * If the connection to the database could not be established.
#[allow(unused_variables)]
#[allow(clippy::unused_async)]
#[utoipa::path(
    context_path = "/api/plantings",
    request_body = UpdatePlantingDto,
    responses(
        (status = 200, description = "Update a planting", body = PlantingDto)
    ),
    security(
        ("oauth2" = [])
    )
)]
#[patch("/{id}")]
pub async fn update(
    id: Path<String>,
    update_seed_json: Json<UpdatePlantingDto>,
    app_data: Data<AppDataInner>,
) -> Result<HttpResponse> {
    // TODO: implement service that validates (permission, integrity) and updates the record.
    let dto = PlantLayerObjectDto {
        id: "uuid".to_string(),
        plant_id: 1,
        x: 0,
        y: 0,
        height: 100,
        width: 100,
        rotation: 0,
        scale_x: 1,
        scale_y: 1,
    };
    Ok(HttpResponse::Ok().json(dto))
}

/// Endpoint for deleting a `Planting`.
///
/// # Errors
/// * If the connection to the database could not be established.
#[allow(unused_variables)]
#[allow(clippy::unused_async)]
#[utoipa::path(
    context_path = "/api/plantings",
    responses(
        (status = 200, description = "Delete a planting", body = String)
    ),
    security(
        ("oauth2" = [])
    )
)]
#[delete("/{id}")]
pub async fn delete(
    path: Path<String>,
    app_data: Data<AppDataInner>,
    user_info: UserInfo,
) -> Result<HttpResponse> {
    // TODO: implement a service that validates (permissions) and deletes the planting
    app_data
        .broadcaster
        .broadcast(
            &DeletePlantActionDto::new(path.to_string(), user_info.id.to_string()).to_string(),
        )
        .await;

    Ok(HttpResponse::Ok().json(""))
}
