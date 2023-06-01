//! Server-Sent Events controller

use actix_web::{
    get,
    web::{Data, Path},
    Responder,
};

use crate::AppDataInner;

/// Create a new SSE client.
#[get("/{user_id}")]
pub async fn create_sse_client(path: Path<String>, state: Data<AppDataInner>) -> impl Responder {
    state.broadcaster.new_client(path.to_string()).await
}
