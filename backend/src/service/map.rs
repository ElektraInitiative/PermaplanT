//! Service layer for maps.

use actix_http::StatusCode;
use actix_web::web::Data;
use uuid::Uuid;

use crate::config::data::AppDataInner;
use crate::model::dto::{MapSearchParameters, Page, UpdateMapDto, BaseLayerImageDto};
use crate::model::dto::{NewLayerDto, PageParameters};
use crate::model::entity::{Layer, BaseLayerImages};
use crate::model::r#enum::layer_type::LayerType;
use crate::{
    error::ServiceError,
    model::{
        dto::{MapDto, NewMapDto},
        entity::Map,
    },
};

/// Defines which layers should be created when a new map is created.
const LAYER_TYPES: [LayerType; 2] = [LayerType::Base, LayerType::Plants];

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
    let result = Map::create(new_map, user_id, &mut conn).await?;
    for layer in &LAYER_TYPES {
        let new_layer = NewLayerDto {
            map_id: result.id,
            type_: *layer,
            name: format!("{layer} Layer"),
            is_alternative: false,
        };
        let new_layer = Layer::create(new_layer, &mut conn).await?;
        if *layer == LayerType::Base {
            let new_base_layer_image = BaseLayerImageDto {
                id: Uuid::new_v4(),
                layer_id: new_layer.id,
                /// The path to the image on Nextcloud.
                path: String::from(""),
                /// The rotation in degrees (0-360) of the image on the map.
                rotation: 0.0,
                /// The scale of the image on the map.
                scale: 100.0,
            };
            BaseLayerImages::create(new_base_layer_image, &mut conn).await?;
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
