//! Server-Sent Events controller

use actix_web::{get, web::Query, Responder};

use crate::{config::data::SharedBroadcaster, model::dto::ConnectToMapQueryParams};

/// Create a new SSE client.
#[get("")]
pub async fn connect_to_map(
    query: Query<ConnectToMapQueryParams>,
    broadcaster: SharedBroadcaster,
) -> impl Responder {
    let query = query.into_inner();
    broadcaster.new_client(query.map_id).await
}
