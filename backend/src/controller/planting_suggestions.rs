//! Planting suggestions endpoint.

use actix_web::{
    get,
    web::{Data, Query},
    HttpResponse, Result,
};

use crate::{
    config::{auth::user_info::UserInfo, data::AppDataInner},
    model::dto::{Page, PageParameters, PlantSuggestionsSearchParameters, SuggestionType},
    service,
};

/// Endpoint for listing suggestions.
/// Suggestions are `Plants` that are suitable for a given `Map`.
///
/// # Errors
/// * If the connection to the database could not be established.
#[utoipa::path(
    context_path = "/api/maps/{map_id}/layers/plants/suggestions",
    params(
        PlantSuggestionsSearchParameters,
        PageParameters,
    ),
    responses(
        (status = 201, description = "", body = PagePlantsSummaryDto)
    ),
    security(
        ("oauth2" = [])
    )
)]
#[get("")]
pub async fn find(
    search_query: Query<PlantSuggestionsSearchParameters>,
    page_query: Query<PageParameters>,
    app_data: Data<AppDataInner>,
    user_info: UserInfo,
) -> Result<HttpResponse> {
    let search_query = search_query.into_inner();

    let response = match search_query.suggestion_type {
        SuggestionType::Available => {
            service::plants::find_available_seasonal(
                search_query,
                page_query.into_inner(),
                user_info.id,
                &app_data,
            )
            .await?
        }
        SuggestionType::Diversity => Page {
            page: 1,
            total_pages: 0,
            per_page: 10,
            results: vec![],
        },
    };

    Ok(HttpResponse::Ok().json(response))
}
