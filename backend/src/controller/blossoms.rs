//! `Blossom` endpoints.

use actix_web::{
    post,
    web::{Data, Json},
    HttpResponse, Result,
};

use crate::{
    config::{auth::user_info::UserInfo, data::AppDataInner},
    model::dto::GainedBlossomsDto,
    service,
};

/// Endpoint for gaining a [`Blossom`](lib_db::model::entity::Blossom).
///
/// # Errors
/// * If the connection to the database could not be established.
#[utoipa::path(
    context_path = "/api/blossoms",
    request_body = BlossomsGainedDto,
    responses(
        (status = 201, description = "The user gains a Blossom", body = BlossomsGainedDto)
    ),
    security(
        ("oauth2" = [])
    )
)]
#[post("")]
pub async fn gain(
    gained_blossom_json: Json<GainedBlossomsDto>,
    user_info: UserInfo,
    app_data: Data<AppDataInner>,
) -> Result<HttpResponse> {
    let response = service::blossoms::gain(gained_blossom_json.0, user_info.id, &app_data).await?;
    Ok(HttpResponse::Created().json(response))
}
