//! Service layer for maps.

use std::collections::HashMap;

use actix_http::{StatusCode, Method};
use actix_web::web::Data;
use log::trace;
use uuid::Uuid;

use crate::config::auth::user_token::UserToken;
use crate::config::data::AppDataInner;
use crate::model::dto::{BaseLayerImageDto, MapSearchParameters, Page, UpdateMapDto};
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
    user_token: UserToken,
) -> Result<MapDto, ServiceError> {
    let mut conn = app_data.pool.get().await?;
    let result = Map::create(new_map.clone(), user_id, &mut conn).await?;
    for layer_type in &LAYER_TYPES {
        let new_layer = NewLayerDto {
            map_id: result.id,
            type_: *layer_type,
            name: format!("{layer_type} Layer"),
            is_alternative: false,
        };
        let layer = Layer::create(new_layer, &mut conn).await?;

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

        let token = user_token.token.clone();
        let map_name = new_map.name.clone();

        // Create a Nextcloud circle with the same name as the map
        let mut map = HashMap::new();
        map.insert("name", map_name.clone());
        map.insert("personal", String::from("false"));
        map.insert("local", String::from("false"));

        let client = reqwest::Client::new();
        let url = "https://cloud.permaplant.net/ocs/v2.php/apps/circles/circles";
        let res = client.post(url)
            .json(&map)
            .header("OCS-APIRequest", "true")
            .header("Content-Type", "application/json")
            .header("Authorization", format!("Bearer {}", token))
            .send()
            .await;
        println!("--------------------------");
        println!("Circle creation Result");
        match res {
            Ok(response) => println!("Circle creation result: {}", response.status()),
            Err(e) => println!("Circle creation failed! {}", e),
        }
        println!("--------------------------");

        // For public maps share the map directory with PermaplanT circle

        // Create a map directory in Nextcloud
        let client = reqwest::Client::new();
        let url = format!("https://cloud.permaplant.net/remote.php/dav/files/{}/PermaplanT/{}", user_id, map_name.clone());
        let res = client.request(Method::from_bytes(b"MKCOL").unwrap(), url)
            .header("Content-Type", "application/json")
            .header("Authorization", format!("Bearer {}", user_token.token))
            .send()
            .await;

        println!("--------------------------");
        println!("Directory creation Result");
        match res {
            Ok(response) => {
                println!("Map directory creation result: {}", response.status())
            },
            Err(e) => println!("Map directory creation failed! {}", e),
        }
        println!("--------------------------");


        // Share the map directory with the circle
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
