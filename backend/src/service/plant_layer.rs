//! Service layer for plant layer.

use std::io::Cursor;

use actix_http::StatusCode;
use image::{ImageBuffer, Rgb};

use crate::{
    config::data::SharedPool,
    error::ServiceError,
    model::{
        dto::{HeatMapQueryParams, RelationSearchParameters, RelationsDto},
        entity::plant_layer,
    },
};

/// Generates a heatmap signaling ideal locations for planting the plant.
/// The return values are raw bytes of an PNG image.
///
/// # Errors
/// * If the connection to the database could not be established.
/// * If no map with id `map_id` exists.
/// * If no layer with id `layer_id` exists, if the layer is not a plant layer or if the layer is not part of the map.
/// * If no plant with id `plant_id` exists.
/// * If the image could not be parsed to bytes.
pub async fn heatmap(
    map_id: i32,
    query_params: HeatMapQueryParams,
    pool: &SharedPool,
) -> Result<Vec<u8>, ServiceError> {
    let mut conn = pool.get().await?;
    let result = plant_layer::heatmap(
        map_id,
        query_params.layer_id,
        query_params.plant_id,
        &mut conn,
    )
    .await?;

    let buffer = matrix_to_image(&result)?;

    Ok(buffer)
}

/// Parses the matrix of scores with values 0-1 to raw bytes of a PNG image.
#[allow(
    clippy::cast_possible_truncation,   // ok, because size of matrix shouldn't ever be larger than u32 and casting to u8 in image should remove floating point values
    clippy::indexing_slicing,           // ok, because size of image is generated using matrix width and height
    clippy::cast_sign_loss              // ok, because we only care about positive values
)]
fn matrix_to_image(matrix: &Vec<Vec<f32>>) -> Result<Vec<u8>, ServiceError> {
    let (width, height) = (matrix[0].len(), matrix.len());
    let mut imgbuf = ImageBuffer::new(width as u32, height as u32);

    for (x, y, pixel) in imgbuf.enumerate_pixels_mut() {
        let data = matrix[y as usize][x as usize];

        // The closer data is to 1 the green it gets.
        let red = data.mul_add(-128.0, 128.0);
        let green = data.mul_add(255.0 - 128.0, 128.0);
        let blue = data.mul_add(-128.0, 128.0);

        *pixel = Rgb([red as u8, green as u8, blue as u8]);
    }

    let mut buffer: Vec<u8> = Vec::new();
    imgbuf
        .write_to(&mut Cursor::new(&mut buffer), image::ImageOutputFormat::Png)
        .map_err(|err| ServiceError::new(StatusCode::INTERNAL_SERVER_ERROR, err.to_string()))?;
    Ok(buffer)
}

/// Get all relations of a certain plant.
///
/// # Errors
/// * If the connection to the database could not be established.
/// * If the SQL query failed.
pub async fn find_relations(
    search_query: RelationSearchParameters,
    pool: &SharedPool,
) -> Result<RelationsDto, ServiceError> {
    let mut conn = pool.get().await?;
    let result = plant_layer::find_relations(search_query, &mut conn).await?;
    Ok(result)
}
