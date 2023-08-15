//! Service layer for maps.

use std::collections::HashMap;

use actix_http::{Method, StatusCode};
use actix_web::web::Data;
use log::{info, log};
use serde::Deserialize;
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

const BASE_URL: &str = "https://cloud.permaplant.net/";

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

fn extract_id_from_doc(doc: &str) -> String {
    let res: CreateCircleResponse = quick_xml::de::from_str(doc).unwrap();
    log::info!("{:?}", res);
    res.data.id
}

fn extract_id_from_circle_search_response(doc: &str) -> String {
    let res: FindCircleResponse = quick_xml::de::from_str(doc).unwrap();
    log::info!("{:?}", res);
    res.data.element.id.clone()
}

#[derive(Debug, Deserialize)]
pub struct CircleData {
    pub id: String,
    pub name: String,
}

#[derive(Debug, Deserialize)]
#[serde(rename_all = "snake_case")]
pub struct FindCircleData {
    pub element: FindCircleDataElement,
}

#[derive(Debug, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct FindCircleDataElement {
    pub id: String,
    pub user_id: String,
    pub user_type: i32,
    pub display_name: String,
    pub instance: String,
}

#[derive(Debug, Deserialize)]
pub struct CreateCircleResponse {
    pub meta: Meta,
    pub data: CircleData,
}

#[derive(Debug, Deserialize)]
pub struct Meta {
    pub status: String,
    pub statuscode: i32,
    pub message: String,
}

#[derive(Debug, Deserialize)]
#[serde(rename_all = "snake_case")]
pub struct FindCircleResponse {
    pub meta: Meta,
    pub data: FindCircleData,
}

// Share a Nextcloud directory with a Nextcloud circle
async fn share_directory(dir_name: String, token: String, circle_id: String) {
    // Share the map directory with the circle
    let mut share_options = HashMap::new();
    share_options.insert("path", format!("/PermaplanT/{}", dir_name));
    share_options.insert("shareType", String::from("7"));
    share_options.insert("permissions", String::from("31"));
    share_options.insert("shareWith", circle_id);

    info!("{:?}", share_options);

    // For public maps share the map directory with PermaplanT circle
    let url = BASE_URL.to_owned() + "ocs/v2.php/apps/files_sharing/api/v1/shares";
    let client = reqwest::Client::new();
    let res = client
        .post(url)
        .json(&share_options)
        .header("OCS-APIRequest", "true")
        .header("Content-Type", "application/json")
        .header("Authorization", format!("Bearer {}", token))
        .send()
        .await;
    log::info!("Share directory with PermaplanT circle");
    match res {
        Ok(response) => {
            log::info!("Share creation result: {}", response.status());
        }
        Err(e) => log::error!("Share creation failed! {}", e),
    }
    log::info!("--------------------------");
}

// Create a Nextlcoud circle and return id
async fn create_nextcloud_circle(map_name: String, token: String) -> Result<String, ServiceError> {
    // Create a Nextcloud circle with the same name as the map
    let mut map = HashMap::new();
    map.insert("name", map_name.clone());
    map.insert("personal", String::from("false"));
    map.insert("local", String::from("false"));

    let client = reqwest::Client::new();

    let url = BASE_URL.to_owned() + "ocs/v2.php/apps/circles/circles";
    let res = client
        .post(url)
        .json(&map)
        .header("OCS-APIRequest", "true")
        .header("Content-Type", "application/json")
        .header("Authorization", format!("Bearer {}", token))
        .send()
        .await;
    log::info!("Circle creation Result");
    log::info!("Token");
    log::info!("{}", token);
    match res {
        Ok(response) => {
            log::info!("Circle creation result: {}", response.status());
            let data = response.text().await.unwrap();
            Ok(extract_id_from_doc(&data))
        }
        Err(e) => {
            log::error!("Circle creation failed! {}", e);
            return Err(ServiceError {
                status_code: StatusCode::INTERNAL_SERVER_ERROR,
                reason: "Circle creation failed!".to_string(),
            });
        }
    }
}

// Create a directory for map data in Nextcloud
async fn create_map_dir(
    user_id: Uuid,
    map_name: String,
    token: String,
) -> Result<(), ServiceError> {
    // Create a map directory in Nextcloud
    let url = format!(
        "{}/remote.php/dav/files/{}/PermaplanT/{}",
        BASE_URL.to_owned(),
        user_id,
        map_name.clone()
    );

    let client = reqwest::Client::new();
    let method = Method::from_bytes(b"MKCOL");
    let method = match method {
        Ok(method) => method,
        Err(_) => {
            return Err(ServiceError {
                status_code: StatusCode::INTERNAL_SERVER_ERROR,
                reason: "invalid method".to_string(),
            })
        }
    };
    log::info!("{:?}", method);
    let res = client
        .request(method, url)
        .header("Content-Type", "application/json")
        .header("Authorization", format!("Bearer {}", token))
        .send()
        .await;

    log::info!("--------------------------");
    log::info!("Directory creation Result");
    match res {
        Ok(response) => {
            log::info!("Map directory creation result: {}", response.status());
        }
        Err(e) => {
            log::info!("Map directory creation failed! {}", e);
            return Err(ServiceError {
                status_code: StatusCode::INTERNAL_SERVER_ERROR,
                reason: "Map directory creation failed".to_string(),
            });
        }
    }
    log::info!("--------------------------");
    Ok(())
}

pub async fn find_circle(name: String, token: String) -> Result<String, ServiceError> {
    let client = reqwest::Client::new();
    let url = format!(
        "{}ocs/v2.php/apps/circles/search?term={}",
        BASE_URL.to_owned(),
        name
    );
    let res = client
        .get(url)
        .header("Content-Type", "application/json")
        .header("Authorization", format!("Bearer {}", token))
        .send()
        .await;

    log::info!("--------------------------");
    log::info!("Directory creation Result");
    match res {
        Ok(response) => {
            log::info!("Find circle result: {}", response.status());
            match response.text().await {
                Ok(v) => Ok(extract_id_from_circle_search_response(&v)),
                Err(_) => Err(ServiceError {
                    status_code: StatusCode::INTERNAL_SERVER_ERROR,
                    reason: "Search circle failed".to_string(),
                }),
            }
        }
        Err(e) => {
            log::info!("Search Circle failed! {}", e);
            return Err(ServiceError {
                status_code: StatusCode::INTERNAL_SERVER_ERROR,
                reason: "Search circle failed".to_string(),
            });
        }
    }
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
    }
    let token = user_token.token.clone();
    let map_name = new_map.name.clone();

    // create Nextcloud circle with the map name
    let circle_id = create_nextcloud_circle(map_name.clone(), token.clone());
    // create a directory with the map name
    create_map_dir(user_id, map_name.clone(), token.clone()).await?;
    share_directory(map_name.clone(), token.clone(), circle_id.await.unwrap()).await;
    //TODO: fetch id from public permaplant circle and share with it if public is checked
    let circle_id = find_circle("PermaplanT".to_owned(), token.clone());
    match circle_id.await {
        Ok(id) => share_directory(map_name.clone(), token.clone(), id),
        Err(e) => {
            log::info!("Failed to share with PermaplanT circle! {}", e);
            return Err(ServiceError {
                status_code: StatusCode::INTERNAL_SERVER_ERROR,
                reason: "Failed to share with PermaplanT circle!".to_string(),
            });
        }
    }.await;

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
