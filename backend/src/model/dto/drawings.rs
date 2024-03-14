use chrono::NaiveDate;
use serde::{Deserialize, Serialize};
use typeshare::typeshare;
use utoipa::ToSchema;
use uuid::Uuid;

use crate::model::r#enum::drawing_shape_kind::DrawingShapeKind;

/// Represents plant planted on a map.
/// E.g. a user drags a plant from the search results and drops it on the map.
#[typeshare]
#[derive(Debug, Clone, Deserialize, ToSchema, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct DrawingDto {
    pub id: Uuid,
    pub kind: DrawingShapeKind,
    pub layer_id: i32,
    pub add_date: Option<NaiveDate>,
    pub remove_date: Option<NaiveDate>,
    pub rotation: f32,
    pub scale_x: f32,
    pub scale_y: f32,
    pub x: i32,
    pub y: i32,
    pub color: String,
    pub fill_enabled: bool,
    pub stroke_width: f32,
    pub properties: serde_json::Value,
}
