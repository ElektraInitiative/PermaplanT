//! `Plants` endpoints.

use crate::{db::connection::Pool, service};
use actix_web::{
    delete, get, post,
    web::{Data, Json, Path},
    HttpResponse, Result,
};

use crate::model::dto::NewBaseLayerDto;

/// Fetch a single [`BaseLayerDto`](crate::model::dto::BaseLayerDto) by its id.
///
/// # Errors
/// * If the connection to the database could not be established.
#[utoipa::path(
    context_path = "/api/layers/base/{id}",
    responses(
        (status = 200, description = "Fetch a base layer by its id", body = BaseLayerDto),
    )
)]
#[get("/{id}")]
pub async fn find_by_id(id: Path<i32>, pool: Data<Pool>) -> Result<HttpResponse> {
    let payload = service::base_layers::find_by_id(*id, &pool).await?;
    Ok(HttpResponse::Ok().json(payload))
}

/// Publish a  [`NewBaseLayerDto`](crate::model::dto::NewBaseLayerDto).
///
/// # Errors
/// * If the connection to the database could not be established.
#[utoipa::path(
    context_path = "/api/layers/base/",
    responses(
        (status = 200, description = "Fetch a base layer by its id", body = BaseLayerDto),
    )
)]
#[post("")]
pub async fn create(
    new_base_layer_json: Json<NewBaseLayerDto>,
    pool: Data<Pool>,
) -> Result<HttpResponse> {
    let response = service::base_layers::create(new_base_layer_json.0, &pool).await?;
    Ok(HttpResponse::Created().json(response))
}

/// Fetch a single [`BaseLayerDto`](crate::model::dto::BaseLayerDto) by its id.
///
/// # Errors
/// * If the connection to the database could not be established.
#[utoipa::path(
    context_path = "/api/layers/base/{id}",
    responses(
        (status = 200, description = "Fetch a base layer by its id", body = BaseLayerDto),
    )
)]
#[delete("/{id}")]
pub async fn delete_by_id(id: Path<i32>, pool: Data<Pool>) -> Result<HttpResponse> {
    let payload = service::base_layers::delete_by_id(*id, &pool).await?;
    Ok(HttpResponse::Ok().json(payload))
}
