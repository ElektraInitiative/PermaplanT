use actix_web::{
    post,
    web::{Data, Json, Path},
    HttpResponse, Result,
};

use crate::{
    config::{auth::user_info::UserInfo, data::AppDataInner},
    model::dto::NewMapCollaboratorDto,
    service,
};
/// Endpoint for creating a new [`MapCollaborator`](crate::model::entity::MapCollaborator).
///
/// # Errors
/// * If the connection to the database could not be established.
#[utoipa::path(
    context_path = "/api/maps/{map_id}/collaborators",
    params(
        ("map_id" = i32, Path, description = "The id of the map on which to collaborate"),
    ),
    request_body = NewMapCollaboratorDto,
    responses(
        (status = 201, description = "Add a new map collaborator", body = MapCollaboratorDto),
    ),
    security(
        ("oauth2" = [])
    )
)]
#[post("")]
pub async fn create(
    json: Json<NewMapCollaboratorDto>,
    map_id: Path<i32>,
    user_info: UserInfo,
    app_data: Data<AppDataInner>,
) -> Result<HttpResponse> {
    let response = service::map_collaborator::create(
        json.into_inner(),
        map_id.into_inner(),
        user_info.id,
        &app_data,
    )
    .await?;

    Ok(HttpResponse::Created().json(response))
}
