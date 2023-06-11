//! `Planting` endpoints.

// As this is just an api draft at this stage there are several clippy errors that
// need to be ignored for the CI to accept this.
// FIXME:
//  Remove these clippy allows when these endpoints are full implemented.

use std::sync::RwLock;

use actix_web::{
    delete, error, get, patch, post,
    web::{Data, Json, Path, Query},
    HttpResponse, Result,
};
use uuid::Uuid;

use crate::model::dto::{NewPlantingDto, PlantingDto, PlantingSearchParameters, UpdatePlantingDto};
use crate::{config::auth::user_info::UserInfo, model::dto::actions::Action};
use crate::{
    config::data::AppDataInner,
    model::dto::actions::{
        CreatePlantActionPayload, DeletePlantActionPayload, MovePlantActionPayload,
        TransformPlantActionPayload,
    },
};

/// FIXME: REMOVE THIS HACK ❗❗❗❗❗❗❗❗❗❗❗❗❗❗❗❗❗❗❗❗❗❗❗❗❗❗❗❗❗❗❗❗❗❗❗❗❗❗❗❗❗❗❗❗❗❗❗❗❗❗❗❗❗❗❗❗❗❗
static PLANTINGS: RwLock<Vec<PlantingDto>> = RwLock::new(vec![]);

/// FIXME: REMOVE
#[allow(clippy::expect_used)]
fn find_planting_by_id(id: Uuid) -> Option<PlantingDto> {
    PLANTINGS
        .read()
        .expect("acquiring read lock failed")
        .iter()
        .find(|planting| planting.id == id)
        .copied()
}

/// FIXME: REMOVE
#[allow(clippy::expect_used)]
fn replace_planting(planting: PlantingDto) {
    let mut plantings = PLANTINGS.write().expect("acquiring write lock failed");
    if let Some(p) = plantings.iter_mut().find(|p| p.id == planting.id) {
        *p = planting;
    }
}

/// Endpoint for listing and filtering `Planting`.
/// If no page parameters are provided, the first page is returned.
///
/// # Errors
/// * If the connection to the database could not be established.
#[allow(unused_variables)]
#[allow(clippy::unused_async)]
#[allow(clippy::expect_used)]
#[utoipa::path(
    context_path = "/api/plantings",
    params(
        PlantingSearchParameters,
    ),
    responses(
        (status = 200, description = "Find plantings", body = Vec<PlantingDto>)
    ),
    security(
        ("oauth2" = [])
    )
)]
#[get("")]
pub async fn find(
    search_query: Query<PlantingSearchParameters>,
    app_data: Data<AppDataInner>,
) -> Result<HttpResponse> {
    let plantings = PLANTINGS
        .read()
        .expect("acquiring read lock failed")
        .clone();

    Ok(HttpResponse::Ok().json(plantings))
}

/// Endpoint for creating a new `Planting`.
///
/// # Errors
/// * If the connection to the database could not be established.
#[allow(unused_variables)]
#[allow(clippy::unused_async)]
#[allow(clippy::expect_used)]
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
    {
        PLANTINGS
            .write()
            .expect("acquiring write lock failed")
            .push(PlantingDto {
                id: new_plant_json.id,
                plant_id: new_plant_json.plant_id,
                x: new_plant_json.x,
                y: new_plant_json.y,
                height: new_plant_json.height,
                width: new_plant_json.width,
                rotation: new_plant_json.rotation,
                scale_x: new_plant_json.scale_x,
                scale_y: new_plant_json.scale_y,
            });
    }

    let dto = find_planting_by_id(new_plant_json.id)
        .ok_or_else(|| error::ErrorInternalServerError("Could not create planting"))?;

    app_data
        .broadcaster
        .broadcast(
            new_plant_json.map_id,
            Action::CreatePlanting(CreatePlantActionPayload::new(dto, user_info.id)),
        )
        .await;

    Ok(HttpResponse::Created().json(dto))
}

/// Endpoint for updating a `Planting`.
///
/// # Errors
/// * If the connection to the database could not be established.
#[allow(unused_variables)]
#[allow(clippy::unused_async)]
#[allow(clippy::expect_used)]
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
#[patch("/{planting_id}")]
pub async fn update(
    path: Path<(i32, Uuid)>,
    new_plant_json: Json<UpdatePlantingDto>,
    app_data: Data<AppDataInner>,
    user_info: UserInfo,
) -> Result<HttpResponse> {
    let (map_id, planting_id) = path.into_inner();

    // TODO: implement service that validates (permission, integrity) and updates the record.
    let mut planting = find_planting_by_id(planting_id)
        .ok_or_else(|| error::ErrorNotFound("Planting not found"))?;

    let action = match *new_plant_json {
        UpdatePlantingDto {
            x: Some(x),
            y: Some(y),
            rotation: Some(rotation),
            scale_x: Some(scale_x),
            scale_y: Some(scale_y),
            ..
        } => {
            planting.x = x;
            planting.y = y;
            planting.rotation = rotation;
            planting.scale_x = scale_x;
            planting.scale_y = scale_y;
            replace_planting(planting);

            Action::TransformPlanting(TransformPlantActionPayload::new(planting, user_info.id))
        }
        UpdatePlantingDto {
            x: Some(x),
            y: Some(y),
            ..
        } => {
            planting.x = x;
            planting.y = y;
            replace_planting(planting);

            Action::MovePlanting(MovePlantActionPayload::new(planting, user_info.id))
        }
        _ => {
            return Err(error::ErrorBadRequest(
                "Invalid arguments passed for update planting",
            ))
        }
    };

    app_data
        .broadcaster
        .broadcast(new_plant_json.map_id, action)
        .await;

    Ok(HttpResponse::Ok().json(planting))
}

/// Endpoint for deleting a `Planting`.
///
/// # Errors
/// * If the connection to the database could not be established.
#[allow(unused_variables)]
#[allow(clippy::unused_async)]
#[allow(clippy::expect_used)]
#[utoipa::path(
    context_path = "/api/plantings",
    responses(
        (status = 200, description = "Delete a planting", body = String)
    ),
    security(
        ("oauth2" = [])
    )
)]
#[delete("/{planting_id}")]
pub async fn delete(
    path: Path<(i32, Uuid)>,
    app_data: Data<AppDataInner>,
    user_info: UserInfo,
) -> Result<HttpResponse> {
    // TODO: implement a service that validates (permissions) and deletes the planting
    let (map_id, planting_id) = path.into_inner();

    {
        let mut plantings = PLANTINGS.write().expect("acquiring write lock failed");
        plantings.retain(|planting| planting.id != planting_id);
    }

    app_data
        .broadcaster
        .broadcast(
            // TODO: get map_id from request or from path?
            1,
            Action::DeletePlanting(DeletePlantActionPayload::new(planting_id, user_info.id)),
        )
        .await;

    Ok(HttpResponse::Ok().finish())
}
