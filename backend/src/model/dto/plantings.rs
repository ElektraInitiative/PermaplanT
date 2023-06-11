//! All DTOs associated with [`PlantingDto`].

use serde::{Deserialize, Serialize};
use typeshare::typeshare;
use utoipa::{IntoParams, ToSchema};

/// Represents plant planted on a map.
/// E.g. a user drags a plant from the search results and drops it on the map.
#[typeshare]
#[derive(Debug, Clone, Copy, Serialize, Deserialize, ToSchema)]
pub struct PlantingDto {
    /// The database id of the record.
    pub id: i32,
    /// The plant layer the plantings is on.
    #[serde(rename = "layerId")]
    pub layer_id: i32,
    /// The plant that is planted.
    #[serde(rename = "plantId")]
    pub plant_id: i32,
    /// The x coordinate of the position on the map.
    pub x: i32,
    /// The y coordinate of the position on the map.
    pub y: i32,
    /// The width of the plant on the map.
    pub width: i32,
    /// The height of the plant on the map.
    pub height: i32,
    /// The rotation in degrees (0-360) of the plant on the map.
    pub rotation: f32,
    /// The x scale of the plant on the map.
    #[serde(rename = "scaleX")]
    pub scale_x: f32,
    /// The y scale of the plant on the map.
    #[serde(rename = "scaleY")]
    pub scale_y: f32,
}

/// Used to create a new planting.
#[typeshare]
#[derive(Debug, Clone, Default, Serialize, Deserialize, ToSchema)]
pub struct NewPlantingDto {
    /// The plant layer the plantings is on.
    pub layer_id: i32,
    /// The plant that is planted.
    pub plant_id: i32,
    /// The x coordinate of the position on the map.
    pub x: i32,
    /// The y coordinate of the position on the map.
    pub y: i32,
    /// The width of the plant on the map.
    pub width: i32,
    /// The height of the plant on the map.
    pub height: i32,
    /// The rotation of the plant on the map.
    pub rotation: f32,
    /// The x scale of the plant on the map.
    #[serde(rename = "scaleX")]
    pub scale_x: f32,
    /// The y scale of the plant on the map.
    #[serde(rename = "scaleY")]
    pub scale_y: f32,
}

/// Used to update an existing planting.
#[typeshare]
#[derive(Debug, Clone, Default, Serialize, Deserialize, ToSchema)]
pub struct UpdatePlantingDto {
    /// The x coordinate of the position on the map.
    pub x: Option<i32>,
    /// The y coordinate of the position on the map.
    pub y: Option<i32>,
    /// The width of the plant on the map.
    pub width: Option<i32>,
    /// The height of the plant on the map.
    pub height: Option<i32>,
    /// The rotation of the plant on the map.
    pub rotation: Option<f32>,
    /// The x scale of the plant on the map.
    #[serde(rename = "scaleX")]
    pub scale_x: Option<f32>,
    /// The y scale of the plant on the map.
    #[serde(rename = "scaleY")]
    pub scale_y: Option<f32>,
}

/// Query parameters for searching plantings.
#[typeshare]
#[derive(Debug, Deserialize, IntoParams)]
pub struct PlantingSearchParameters {
    /// The id of the plant the planting references.
    pub plant_id: Option<i32>,
    /// The id of the plants layer the planting is placed on.
    pub plants_layer_id: Option<i32>,
}
