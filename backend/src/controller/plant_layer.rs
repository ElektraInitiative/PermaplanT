//! Plant layer endpoints.

use actix_web::{
    get,
    web::{Path, Query},
    HttpResponse, Result,
};

use crate::{
    config::data::SharedPool,
    model::dto::{HeatMapQueryParams, RelationSearchParameters},
    service::plant_layer,
};

/// Endpoint for generating a heatmap signaling ideal locations for planting the plant.
///
/// Grey pixels signal areas where the plant shouldn't be planted, while green areas signal ideal locations.
///
/// The resulting heatmap does represent actual coordinates, meaning the pixel at (0,0) is not necessarily at coordinates (0,0).
/// Instead the image has to be moved and scaled to fit inside the maps boundaries.
/// This means the lower left corner of the heatmap has to be moved/scaled to the (x_min,y_min) coordinate, while the upper right corner has to be moved/scaled to (x_max,y_max).
///
/// Here is pseudocode for how to move the map to the correct place in the frontend:
///
/// ```js
/// // 1. Extract the polygon object from the map:
/// let polygon = map.geometry;
///
/// // 2. Calculate the min and max coordinates for the map:
/// let x_min = Math.min(...polygon.rings[0].map(point => point.x));
/// let y_min = Math.min(...polygon.rings[0].map(point => point.y));
/// let x_max = Math.max(...polygon.rings[0].map(point => point.x));
/// let y_max = Math.max(...polygon.rings[0].map(point => point.y));
///
/// // 3. Calculate the map's width and height:
/// let map_width = x_max - x_min;
/// let map_height = y_max - y_min;
///
/// // 4. Fetch the heatmap image from the server and draw it on the canvas.
/// let heatmapResponse = await fetch('/path/to/your/heatmap/endpoint');
/// let heatmapBlob = await heatmapResponse.blob();
///
/// // From https://konvajs.org/docs/shapes/Image.html.
/// var imageObj = new Image();
/// imageObj.onload = function () {
///     var heatmap = new Konva.Image({
///         x: x_min,
///         y: y_min,
///         image: imageObj,
///         width: map_width,
///         height: map_height,
///     });
///     // add the shape to the layer
///     layer.add(heatmap);
///   };
/// imageObj.src = URL.createObjectURL(heatmapBlob);
/// ```
///
/// # Errors
/// * If the connection to the database could not be established.
#[utoipa::path(
    context_path = "/api/maps/{map_id}/layers/plants",
    params(
        ("map_id" = i32, Path, description = "The id of the map the layer is on"),
        HeatMapQueryParams
    ),
    responses(
        (status = 200, description = "Returns the heatmap.", body = Vec<u8>, content_type = "image/png")
    ),
    security(
        ("oauth2" = [])
    )
)]
#[get("/heatmap")]
pub async fn heatmap(
    query_params: Query<HeatMapQueryParams>,
    map_id: Path<i32>,
    pool: SharedPool,
) -> Result<HttpResponse> {
    let response =
        plant_layer::heatmap(map_id.into_inner(), query_params.into_inner(), &pool).await?;
    Ok(HttpResponse::Ok().content_type("image/png").body(response))
}

/// Endpoint for finding all relations of a certain plant.
///
/// # Errors
/// * If the connection to the database could not be established.
#[utoipa::path(
    context_path = "/api/maps/{map_id}/layers/plants",
    params(
        ("map_id" = i32, Path, description = "The id of the map the layer is on (TODO: currently unused)"),
        RelationSearchParameters
    ),
    responses(
        (status = 200, description = "Find relations to given plant", body = RelationsDto)
    ),
    security(
        ("oauth2" = [])
    )
)]
#[get("/relations")]
pub async fn find_relations(
    search_query: Query<RelationSearchParameters>,
    pool: SharedPool,
) -> Result<HttpResponse> {
    let response = plant_layer::find_relations(search_query.into_inner(), &pool).await?;
    Ok(HttpResponse::Ok().json(response))
}
