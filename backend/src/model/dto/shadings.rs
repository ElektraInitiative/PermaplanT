//! All DTOs associated with [`ShadingDto`].

use chrono::NaiveDate;
use postgis_diesel::types::{Point, Polygon};
use serde::{Deserialize, Serialize};
use typeshare::typeshare;
use utoipa::{IntoParams, ToSchema};
use uuid::Uuid;

use crate::model::r#enum::shade::Shade;

/// Represents shade on a map.
#[typeshare]
#[derive(Debug, Clone, Serialize, Deserialize, ToSchema)]
#[serde(rename_all = "camelCase")]
pub struct ShadingDto {
    /// The id of the shading.
    pub id: Uuid,
    /// The layer the shadings is on.
    pub layer_id: i32,
    /// The type/strength of shade.
    pub shade: Shade,
    /// The position of the shade on the map.
    ///
    /// E.g. `{"rings": [[{"x": 0.0,"y": 0.0},{"x": 1000.0,"y": 0.0},{"x": 1000.0,"y": 1000.0},{"x": 0.0,"y": 1000.0},{"x": 0.0,"y": 0.0}]],"srid": 4326}`
    #[schema(value_type = Object)]
    pub geometry: Polygon<Point>,
    /// The date the shading was added to the map.
    /// If None, the shading always existed.
    pub add_date: Option<NaiveDate>,
    /// The date the shading was removed from the map.
    /// If None, the shading is still on the map.
    pub remove_date: Option<NaiveDate>,
}

/// Used to create a new shading.
#[typeshare]
#[derive(Debug, Clone, Serialize, Deserialize, ToSchema)]
#[serde(rename_all = "camelCase")]
pub struct NewShadingDto {
    /// The id of the shading.
    pub id: Option<Uuid>,
    /// The plant layer the shadings is on.
    pub layer_id: i32,
    /// The type/strength of shade.
    pub shade: Shade,
    /// The position of the shade on the map.
    ///
    /// E.g. `{"rings": [[{"x": 0.0,"y": 0.0},{"x": 1000.0,"y": 0.0},{"x": 1000.0,"y": 1000.0},{"x": 0.0,"y": 1000.0},{"x": 0.0,"y": 0.0}]],"srid": 4326}`
    #[schema(value_type = Object)]
    pub geometry: Polygon<Point>,
    /// The date the shading was added to the map.
    /// If None, the shading always existed.
    pub add_date: Option<NaiveDate>,
    /// Id of the action (for identifying the action in the frontend).
    pub action_id: Uuid,
}

/// Used to differentiate between different update operations on shadings.
///
/// Ordering of enum variants is important.
/// Serde will try to deserialize starting from the top.
#[typeshare]
#[derive(Debug, Clone, Serialize, Deserialize, ToSchema)]
#[serde(tag = "type", content = "content")]
pub enum UpdateShadingDto {
    /// Update values of a shading.
    Update(Vec<UpdateValuesShadingDto>),
    /// Change the `add_date` of a shading.
    UpdateAddDate(Vec<UpdateAddDateShadingDto>),
    /// Change the `remove_date` of a shading.
    UpdateRemoveDate(Vec<UpdateRemoveDateShadingDto>),
}

/// Used to update the values of an existing shading.
#[typeshare]
#[derive(Debug, Clone, Serialize, Deserialize, ToSchema)]
pub struct UpdateValuesShadingDto {
    /// The id of the shading.
    pub id: Uuid,
    /// The type/strength of shade.
    pub shade: Option<Shade>,
    /// The position of the shade on the map.
    ///
    /// E.g. `{"rings": [[{"x": 0.0,"y": 0.0},{"x": 1000.0,"y": 0.0},{"x": 1000.0,"y": 1000.0},{"x": 0.0,"y": 1000.0},{"x": 0.0,"y": 0.0}]],"srid": 4326}`
    #[schema(value_type = Option<Object>)]
    pub geometry: Option<Polygon<Point>>,
    /// Id of the action (for identifying the action in the frontend).
    pub action_id: Uuid,
}

/// Used to change the `add_date` of a shading.
#[typeshare]
#[derive(Debug, Clone, Copy, Serialize, Deserialize, ToSchema)]
#[serde(rename_all = "camelCase")]
pub struct UpdateAddDateShadingDto {
    /// The id of the shading.
    pub id: Uuid,
    /// The date the shading was added to the map.
    /// If None, the shading always existed.
    pub add_date: Option<NaiveDate>,
    /// Id of the action (for identifying the action in the frontend).
    pub action_id: Uuid,
}

/// Used to change the `remove_date` of a shading.
#[typeshare]
#[derive(Debug, Clone, Copy, Serialize, Deserialize, ToSchema)]
#[serde(rename_all = "camelCase")]
pub struct UpdateRemoveDateShadingDto {
    /// The id of the shading.
    pub id: Uuid,
    /// The date the shading was removed from the map.
    /// If None, the shading is still on the map.
    pub remove_date: Option<NaiveDate>,
    /// Id of the action (for identifying the action in the frontend).
    pub action_id: Uuid,
}

/// Used to delete a shading.
/// The id of the shading is passed in the path.
#[typeshare]
#[derive(Debug, Clone, Copy, Serialize, Deserialize, ToSchema)]
#[serde(rename_all = "camelCase")]
pub struct DeleteShadingDto {
    /// The id of the shading.
    pub id: Uuid,
    /// Id of the action (for identifying the action in the frontend).
    pub action_id: Uuid,
}

/// Query parameters for searching shadings.
#[typeshare]
#[derive(Debug, Deserialize, IntoParams)]
pub struct ShadingSearchParameters {
    /// The id of the layer the shading is placed on.
    pub layer_id: Option<i32>,
    /// Shadings that exist around this date are returned.
    pub relative_to_date: NaiveDate,
}
