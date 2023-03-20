//! `Plants` endpoints.

use crate::{config::db::Pool, model::response::Body, service};
use actix_web::{
    get,
    web::{self, Data, Path},
    HttpResponse, Result,
};

/// Endpoint for fetching all [`PlantsDto`](crate::model::dto::PlantsDto).
///
/// # Errors
/// * If the connection to the database could not be established.
/// * If [web::block] fails.
#[get("")]
pub async fn find_all(pool: Data<Pool>) -> Result<HttpResponse> {
    let response = web::block(move || service::plants::find_all(&pool)).await??;
    Ok(HttpResponse::Ok().json(Body::from(response)))
}

/// Endpoint for fetching a [`Plant`](crate::model::entity::Plants).
///
/// # Errors
/// * If the connection to the database could not be established.
/// * If [web::block] fails.
#[get("/{id}")]
pub async fn find_by_id(id: Path<i32>, pool: Data<Pool>) -> Result<HttpResponse> {
    let response = web::block(move || service::plants::find_by_id(*id, &pool)).await??;
    Ok(HttpResponse::Ok().json(Body::from(response)))
}
