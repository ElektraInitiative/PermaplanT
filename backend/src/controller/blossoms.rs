//! `Blossom` endpoints.

use actix_web::{post, web::Json, HttpResponse, Result};

use crate::config::data::SharedPool;
use crate::{config::auth::user_info::UserInfo, model::dto::GainedBlossomsDto, service};

/// Endpoint for gaining a [`Blossom`](crate::model::entity::Blossom).
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
    pool: SharedPool,
) -> Result<HttpResponse> {
    let response = service::blossoms::gain(gained_blossom_json.0, user_info.id, &pool).await?;
    Ok(HttpResponse::Created().json(response))
}
