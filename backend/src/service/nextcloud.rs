use crate::error::ServiceError;
use actix_http::{Method, StatusCode};
use serde::{Deserialize, Serialize};
use uuid::Uuid;

const BASE_URL: &str = "https://cloud.permaplant.net/";

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

fn extract_id_from_doc(doc: &str) -> String {
    let res: CreateCircleResponse = quick_xml::de::from_str(doc).unwrap();
    log::debug!("{:?}", res);
    res.data.id
}

fn extract_id_from_circle_search_response(doc: &str) -> String {
    let res: FindCircleResponse = quick_xml::de::from_str(doc).unwrap();
    log::debug!("{:?}", res);
    res.data.element.id.clone()
}

pub async fn setup_nextcloud_shares(
    user_id: Uuid,
    map_name: &str,
    token: &str,
    _should_share_publicly: bool,
) -> Result<(), ServiceError> {
    // create Nextcloud circle with the map name
    let circle_id = create_nextcloud_circle(map_name, token).await?;
    // create a directory with the map name
    create_directory(user_id, map_name, token).await?;
    // create a directory for the base layer within
    create_directory(user_id, &format!("{}/Base/", map_name), token).await?;
    share_directory(map_name, token, circle_id).await?;

    // FIXME: nextcloud returns 500 error
    // if should_share_publicly {
    //     let public_circle_id = find_circle("PermaplanT", token).await?;
    //     share_directory(map_name, token, public_circle_id).await?;
    // }

    Ok(())
}

#[derive(Debug, Deserialize)]
#[serde(rename_all = "snake_case")]
pub struct FindCircleResponse {
    pub meta: Meta,
    pub data: FindCircleData,
}

#[derive(Serialize, Debug)]
#[serde(rename_all = "camelCase")]
struct NextcloudSharedOptionsDto {
    path: String,
    share_type: i16,
    permissions: i16,
    share_with: String,
}

// Share a Nextcloud directory with a Nextcloud circle
async fn share_directory(
    dir_name: &str,
    token: &str,
    circle_id: String,
) -> Result<(), ServiceError> {
    // Share the map directory with the circle
    let share_options = NextcloudSharedOptionsDto {
        path: format!("/PermaplanT/{}", dir_name),
        share_type: 7,
        permissions: 31,
        share_with: circle_id.to_owned(),
    };

    log::debug!("Sharing directory");
    log::debug!("{:?}", share_options);

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

    match res {
        Ok(response) => {
            let status_code = response.status();
            let response_text = response.text().await.expect("Could not get response text");

            match status_code {
                StatusCode::OK => Ok(()),
                _ => {
                    log::error!("Share creation failed! {}", response_text);
                    Err(ServiceError {
                        status_code: StatusCode::BAD_REQUEST,
                        reason: "Share creation failed!".to_string(),
                    })
                }
            }
        }
        Err(e) => {
            log::error!("Share creation failed! {}", e);
            Err(ServiceError {
                status_code: StatusCode::INTERNAL_SERVER_ERROR,
                reason: "Share creation failed!".to_string(),
            })
        }
    }
}

#[derive(Serialize)]
struct CreateNextcloudCircleDto {
    name: String,
    personal: bool,
    local: bool,
}

// Create a Nextcloud circle and return id
async fn create_nextcloud_circle(map_name: &str, token: &str) -> Result<String, ServiceError> {
    // TODO: validate map_name to match nextcloud requirements for circle names

    // Create a Nextcloud circle with the same name as the map
    let payload = CreateNextcloudCircleDto {
        name: map_name.to_owned(),
        personal: false,
        local: false,
    };

    let client = reqwest::Client::new();

    let url = BASE_URL.to_owned() + "ocs/v2.php/apps/circles/circles";
    let res = client
        .post(url)
        .json(&payload)
        .header("OCS-APIRequest", "true")
        .header("Content-Type", "application/json")
        .header("Authorization", format!("Bearer {}", token))
        .send()
        .await;
    log::info!("Token: {}", token);
    match res {
        Ok(response) => {
            let status_code = response.status();
            let response_text = response.text().await.expect("Could not get response text");
            log::debug!("Circle creation result: {}", status_code);

            match status_code {
                StatusCode::OK => Ok(extract_id_from_doc(&response_text)),
                _ => {
                    log::error!("Circle creation failed! {}", response_text);
                    Err(ServiceError {
                        status_code: StatusCode::BAD_REQUEST,
                        reason: "Circle creation failed!".to_string(),
                    })
                }
            }
        }
        Err(e) => {
            log::error!("Circle creation failed! {}", e);
            Err(ServiceError {
                status_code: StatusCode::INTERNAL_SERVER_ERROR,
                reason: "Circle creation failed!".to_string(),
            })
        }
    }
}

// Create a directory in Nextcloud
async fn create_directory(user_id: Uuid, path: &str, token: &str) -> Result<(), ServiceError> {
    // Create a map directory in Nextcloud
    let url = format!(
        "{}/remote.php/dav/files/{}/PermaplanT/{}",
        BASE_URL.to_owned(),
        user_id,
        path.clone()
    );

    let client = reqwest::Client::new();
    let method = Method::from_bytes(b"MKCOL");
    let method = match method {
        Ok(method) => method,
        Err(e) => {
            log::error!("Circle creation failed! {}", e);
            return Err(ServiceError {
                status_code: StatusCode::INTERNAL_SERVER_ERROR,
                reason: "invalid method".to_string(),
            });
        }
    };
    let res = client
        .request(method, url)
        .header("Content-Type", "application/json")
        .header("Authorization", format!("Bearer {}", token))
        .send()
        .await;

    match res {
        Ok(response) => {
            log::debug!("Map directory creation result: {}", response.status());
            Ok(())
        }
        Err(e) => {
            log::error!("Map directory creation failed! {}", e);
            Err(ServiceError {
                status_code: StatusCode::INTERNAL_SERVER_ERROR,
                reason: "Map directory creation failed".to_string(),
            })
        }
    }
}

// Find a Nextcloud circle by name
pub async fn find_circle(name: &str, token: &str) -> Result<String, ServiceError> {
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
            Err(ServiceError {
                status_code: StatusCode::INTERNAL_SERVER_ERROR,
                reason: "Search circle failed".to_string(),
            })
        }
    }
}
