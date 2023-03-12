//! `Seed` endpoints.

use actix_web::{
    delete, get, post,
    web::{self, Data, Json, Path},
    HttpResponse, Result,
};

use crate::{
    config::db::Pool,
    model::{dto::NewSeedDto, response::Body},
    service,
};

/// Endpoint for fetching all [`SeedDto`](crate::model::dto::SeedDto).
///
/// # Errors
/// * If the connection to the database could not be established.
/// * If [web::block] fails.
#[get("")]
pub async fn find_all(pool: Data<Pool>) -> Result<HttpResponse> {
    let response = web::block(move || service::seed::find_all(&pool)).await??;
    Ok(HttpResponse::Ok().json(Body::from(response)))
}

/// Endpoint for creating a new [`Seed`](crate::model::entity::Seed).
///
/// # Errors
/// * If the connection to the database could not be established.
/// * If [web::block] fails.
#[post("")]
pub async fn create(new_seed_json: Json<NewSeedDto>, pool: Data<Pool>) -> Result<HttpResponse> {
    let response = web::block(move || service::seed::create(new_seed_json.0, &pool)).await??;
    Ok(HttpResponse::Created().json(Body::from(response)))
}

/// Endpoint for deleting a [`Seed`](crate::model::entity::Seed).
///
/// # Errors
/// * If the connection to the database could not be established.
/// * If [web::block] fails.
#[delete("/{id}")]
pub async fn delete_by_id(path: Path<i32>, pool: Data<Pool>) -> Result<HttpResponse> {
    web::block(move || service::seed::delete_by_id(*path, &pool)).await??;
    Ok(HttpResponse::Ok().json(Body::from("")))
}
