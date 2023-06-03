//! Server-Sent Events controller

use actix_web::{
    get,
    web::{Data, Query},
    Responder,
};

use crate::{model::dto::ConnectToMapQueryParams, AppDataInner};

/// Create a new SSE client.
#[get("")]
pub async fn connect_to_map(
    query: Query<ConnectToMapQueryParams>,
    state: Data<AppDataInner>,
) -> impl Responder {
    let query = query.into_inner();
    state
        .broadcaster
        .new_client(query.map_id, query.user_id)
        .await
}
