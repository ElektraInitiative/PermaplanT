//! All DTOs associated with [`PlantingDto`].

use chrono::NaiveDate;
use serde::{Deserialize, Serialize};
use typeshare::typeshare;
use utoipa::{IntoParams, ToSchema};
use uuid::Uuid;

/// Represents plant planted on a map.
/// E.g. a user drags a plant from the search results and drops it on the map.
#[typeshare]
#[derive(Debug, Clone, Serialize, Deserialize, ToSchema)]
#[serde(rename_all = "camelCase")]
pub struct PlantingDto {
    /// The id of the planting.
    pub id: Uuid,
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
    /// The rotation in degrees (0-360) of the plant on the map.
    pub rotation: f32,
    /// The x scale of the plant on the map.
    pub scale_x: f32,
    /// The y scale of the plant on the map.
    pub scale_y: f32,
    /// The date the planting was added to the map.
    /// If None, the planting always existed.
    pub add_date: Option<NaiveDate>,
    /// The date the planting was removed from the map.
    /// If None, the planting is still on the map.
    pub remove_date: Option<NaiveDate>,
    /// Plantings may be linked with a seed.
    pub seed_id: Option<i32>,
    /// Equivalent to the seed name.
    /// It is used to display the full plant name on a map
    /// even if a user does not have access to the seed.
    pub additional_name: Option<String>,
}

/// Used to create a new planting.
#[typeshare]
#[derive(Debug, Clone, Default, Serialize, Deserialize, ToSchema)]
#[serde(rename_all = "camelCase")]
pub struct NewPlantingDto {
    /// The id of the planting.
    pub id: Option<Uuid>,
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
    pub scale_x: f32,
    /// The y scale of the plant on the map.
    pub scale_y: f32,
    /// The date the planting was added to the map.
    /// If None, the planting always existed.
    pub add_date: Option<NaiveDate>,
    /// Id of the action (for identifying the action in the frontend).
    pub action_id: Uuid,
    /// Plantings may be linked with a seed.
    pub seed_id: Option<i32>,
}

/// Used to differentiate between different update operations on plantings.
///
/// Ordering of enum variants is important.
/// Serde will try to deserialize starting from the top.
#[typeshare]
#[derive(Debug, Clone, Copy, Serialize, Deserialize, ToSchema)]
#[serde(tag = "type", content = "content")]
pub enum UpdatePlantingDto {
    /// Transform a plantings.
    Transform(TransformPlantingDto),
    /// Move a plantings an the map.
    Move(MovePlantingDto),
    /// Change the `add_date` of a planting.
    UpdateAddDate(UpdateAddDatePlantingDto),
    /// Change the `remove_date` of a planting.
    UpdateRemoveDate(UpdateRemoveDatePlantingDto),
}

/// Used to transform an existing planting.
#[typeshare]
#[derive(Debug, Clone, Copy, Serialize, Deserialize, ToSchema)]
#[serde(rename_all = "camelCase")]
pub struct TransformPlantingDto {
    /// The x coordinate of the position on the map.
    pub x: i32,
    /// The y coordinate of the position on the map.
    pub y: i32,
    /// The rotation of the plant on the map.
    pub rotation: f32,
    /// The x scale of the plant on the map.
    pub scale_x: f32,
    /// The y scale of the plant on the map.
    pub scale_y: f32,
    /// Id of the action (for identifying the action in the frontend).
    pub action_id: Uuid,
}

/// Used to move an existing planting.
#[typeshare]
#[derive(Debug, Clone, Copy, Serialize, Deserialize, ToSchema)]
#[serde(rename_all = "camelCase")]
pub struct MovePlantingDto {
    /// The x coordinate of the position on the map.
    pub x: i32,
    /// The y coordinate of the position on the map.
    pub y: i32,
    /// Id of the action (for identifying the action in the frontend).
    pub action_id: Uuid,
}

/// Used to change the `add_date` of a planting.
#[typeshare]
#[derive(Debug, Clone, Copy, Serialize, Deserialize, ToSchema)]
#[serde(rename_all = "camelCase")]
pub struct UpdateAddDatePlantingDto {
    /// The date the planting was added to the map.
    /// If None, the planting always existed.
    pub add_date: Option<NaiveDate>,
    /// Id of the action (for identifying the action in the frontend).
    pub action_id: Uuid,
}

/// Used to change the `remove_date` of a planting.
#[typeshare]
#[derive(Debug, Clone, Copy, Serialize, Deserialize, ToSchema)]
#[serde(rename_all = "camelCase")]
pub struct UpdateRemoveDatePlantingDto {
    /// The date the planting was removed from the map.
    /// If None, the planting is still on the map.
    pub remove_date: Option<NaiveDate>,
    /// Id of the action (for identifying the action in the frontend).
    pub action_id: Uuid,
}

/// Used to delete a planting.
/// The id of the planting is passed in the path.
#[typeshare]
#[derive(Debug, Clone, Copy, Serialize, Deserialize, ToSchema)]
#[serde(rename_all = "camelCase")]
pub struct DeletePlantingDto {
    /// Id of the action (for identifying the action in the frontend).
    pub action_id: Uuid,
}

/// Query parameters for searching plantings.
#[typeshare]
#[derive(Debug, Deserialize, IntoParams)]
pub struct PlantingSearchParameters {
    /// The id of the plant the planting references.
    pub plant_id: Option<i32>,
    /// The id of the plants layer the planting is placed on.
    pub layer_id: Option<i32>,
    /// Plantings that exist around this date are returned.
    pub relative_to_date: NaiveDate,
}
