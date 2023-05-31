use actix_web::{
    delete, get, patch, post,
    web::{Data, Json, Path},
    HttpResponse, Responder, Result,
};

use crate::AppDataInner;

#[get("/{user_id}")]
pub async fn create_sse_client(path: Path<String>, state: Data<AppDataInner>) -> impl Responder {
    state.broadcaster.new_client(path.to_string()).await
}
