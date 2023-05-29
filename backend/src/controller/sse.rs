use actix_web::{
    delete, get, patch, post,
    web::{Data, Json, Path},
    HttpResponse, Responder, Result,
};

use crate::AppDataInner;

#[get("/{user_id}")]
pub async fn create_sse_client(path: Path<String>, state: Data<AppDataInner>) -> impl Responder {
    println!("{}", path);

    state.broadcaster.new_client(path.to_string()).await
}

// pub async fn broadcast_msg(
//     state: Data<AppDataInner>,
//     Path((msg)): Path<(String)>,
// ) -> impl Responder {
//     state.broadcaster.broadcast(&msg).await;
//     HttpResponse::Ok().body("msg sent")
// }
