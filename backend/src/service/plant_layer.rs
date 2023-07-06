//! Service layer for plant layer.

use std::io::Cursor;

use actix_http::StatusCode;
use actix_web::web::Data;
use image::{ImageBuffer, Luma};

use crate::{
    config::data::AppDataInner,
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
/// * If the SQL query failed.
/// * If the image could not be parsed to bytes.
pub async fn heatmap(
    map_id: i32,
    query_params: HeatMapQueryParams,
    app_data: &Data<AppDataInner>,
) -> Result<Vec<u8>, ServiceError> {
    let mut conn = app_data.pool.get().await?;
    let result = plant_layer::heatmap(map_id, query_params.plant_id, &mut conn).await?;

    let buffer = matrix_to_image(result)?;

    Ok(buffer)
}

/// Parses the matrix of scores with values 0-1 to raw bytes of a PNG image.
fn matrix_to_image(matrix: Vec<Vec<f32>>) -> Result<Vec<u8>, ServiceError> {
    let (width, height) = (matrix[0].len(), matrix.len());
    let mut imgbuf = ImageBuffer::new(width as u32, height as u32);
    for (x, y, pixel) in imgbuf.enumerate_pixels_mut() {
        let data = matrix[y as usize][x as usize];
        // Normalize the data to 0-255 as required by the image::Luma
        *pixel = Luma([(data * 255.0) as u8]);
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
    app_data: &Data<AppDataInner>,
) -> Result<RelationsDto, ServiceError> {
    let mut conn = app_data.pool.get().await?;
    let result = plant_layer::find_relations(search_query, &mut conn).await?;
    Ok(result)
}
