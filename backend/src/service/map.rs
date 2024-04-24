//! Service layer for maps.

use actix_http::StatusCode;
use actix_web::web::Data;
use postgis_diesel::types::{Point, Polygon};
use uuid::Uuid;

use crate::config::data::AppDataInner;
use crate::model::dto::{
    BaseLayerImageDto, MapSearchParameters, Page, UpdateMapDto, UpdateMapGeometryDto,
};
use crate::model::dto::{NewLayerDto, PageParameters};
use crate::model::entity::{BaseLayerImages, Layer};
use crate::model::r#enum::layer_type::LayerType;
use crate::{
    error::ServiceError,
    model::{
        dto::{MapDto, NewMapDto},
        entity::Map,
    },
};

/// Defines which layers should be created when a new map is created.
const LAYER_TYPES: [LayerType; 3] = [LayerType::Base, LayerType::Drawing, LayerType::Plants];

/// Search maps from the database.
///
/// # Errors
/// If the connection to the database could not be established.
pub async fn find(
    search_parameters: MapSearchParameters,
    page_parameters: PageParameters,
    app_data: &Data<AppDataInner>,
) -> Result<Page<MapDto>, ServiceError> {
    let mut conn = app_data.pool.get().await?;
    let result = Map::find(search_parameters, page_parameters, &mut conn).await?;
    Ok(result)
}

/// Find a map by id in the database.
///
/// # Errors
/// If the connection to the database could not be established.
pub async fn find_by_id(id: i32, app_data: &Data<AppDataInner>) -> Result<MapDto, ServiceError> {
    let mut conn = app_data.pool.get().await?;
    let result = Map::find_by_id(id, &mut conn).await?;
    Ok(result)
}

/// Create a new map in the database.
///
/// # Errors
/// If the connection to the database could not be established.
pub async fn create(
    new_map: NewMapDto,
    user_id: Uuid,
    app_data: &Data<AppDataInner>,
) -> Result<MapDto, ServiceError> {
    let mut conn = app_data.pool.get().await?;

    let geometry_validation_result = is_valid_map_geometry(&new_map.geometry);
    if let Some(error) = geometry_validation_result {
        return Err(error);
    }

    let result = Map::create(new_map, user_id, &mut conn).await?;
    for layer_type in &LAYER_TYPES {
        let new_layer = NewLayerDto {
            type_: *layer_type,
            name: format!("{layer_type} Layer"),
            is_alternative: false,
        };
        let layer = Layer::create(result.id, new_layer, &mut conn).await?;

        // Immediately initialize a base layer image,
        // because the frontend would always have to create one
        // anyway.
        if layer.type_ == LayerType::Base {
            BaseLayerImages::create(
                BaseLayerImageDto {
                    id: Uuid::new_v4(),
                    layer_id: layer.id,
                    path: String::new(),
                    rotation: 0.0,
                    scale: 100.0,
                    action_id: Uuid::nil(),
                },
                &mut conn,
            )
            .await?;
        }
    }

    Ok(result)
}

/// Update a map in the database.
/// Checks if the map is owned by the requesting user.
///
/// # Errors
/// If the connection to the database could not be established.
/// If the requesting user is not the owner of the map.
pub async fn update(
    map_update: UpdateMapDto,
    id: i32,
    user_id: Uuid,
    app_data: &Data<AppDataInner>,
) -> Result<MapDto, ServiceError> {
    let mut conn = app_data.pool.get().await?;
    let map = Map::find_by_id(id, &mut conn).await?;
    if map.owner_id != user_id {
        return Err(ServiceError {
            status_code: StatusCode::FORBIDDEN,
            reason: "No permission to update data".to_owned(),
        });
    }
    let result = Map::update(map_update, id, &mut conn).await?;
    Ok(result)
}

/// Update a maps gemoetry in the database.
/// Checks if the map is owned by the requesting user.
///
/// # Errors
/// * If the connection to the database could not be established.
/// * If the requesting user is not the owner of the map.
pub async fn update_geomtery(
    map_update_geometry: UpdateMapGeometryDto,
    id: i32,
    user_id: Uuid,
    app_data: &Data<AppDataInner>,
) -> Result<MapDto, ServiceError> {
    let mut conn = app_data.pool.get().await?;
    let map = Map::find_by_id(id, &mut conn).await?;
    if map.owner_id != user_id {
        return Err(ServiceError {
            status_code: StatusCode::FORBIDDEN,
            reason: "No permission to update data".to_owned(),
        });
    }

    let geometry_validation_result = is_valid_map_geometry(&map_update_geometry.geometry);
    if let Some(error) = geometry_validation_result {
        return Err(error);
    }

    let result = Map::update_geometry(map_update_geometry, id, &mut conn).await?;
    Ok(result)
}

/// Checks if a Polygon can be used as a maps geometry attribute.
fn is_valid_map_geometry(geometry: &Polygon<Point>) -> Option<ServiceError> {
    if geometry.rings.len() != 1 {
        return Some(ServiceError {
            status_code: StatusCode::BAD_REQUEST,
            reason: "Map geometry must have exactly one ring".to_owned(),
        });
    }

    let geometry_points_length = geometry.rings.get(0).unwrap_or(&Vec::new()).len();

    if geometry_points_length < 3 + 1 {
        return Some(ServiceError {
            status_code: StatusCode::BAD_REQUEST,
            reason: "Map geometry must be a polygon of at least three points.".to_owned(),
        });
    }

    None
}
