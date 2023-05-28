use actix_web::{
    delete, get, patch, post,
    web::{Data, Json, Path},
    HttpResponse, Responder, Result,
};

use crate::AppDataInner;

#[get("")]
pub async fn sse_client(state: Data<AppDataInner>) -> impl Responder {
    state.broadcaster.new_client().await
}

// pub async fn broadcast_msg(
//     state: Data<AppDataInner>,
//     Path((msg)): Path<(String)>,
// ) -> impl Responder {
//     state.broadcaster.broadcast(&msg).await;
//     HttpResponse::Ok().body("msg sent")
// }
