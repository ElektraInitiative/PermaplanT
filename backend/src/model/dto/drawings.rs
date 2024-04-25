use chrono::NaiveDate;
use serde::{Deserialize, Serialize};
use typeshare::typeshare;
use utoipa::ToSchema;
use uuid::Uuid;

/// Represents user drawing.
#[typeshare]
#[derive(Debug, Clone, Deserialize, ToSchema, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct DrawingDto {
    pub id: Uuid,

    pub variant: DrawingVariant,

    pub layer_id: i32,
    pub add_date: Option<NaiveDate>,
    pub remove_date: Option<NaiveDate>,
    pub rotation: f32,
    pub scale_x: f32,
    pub scale_y: f32,
    pub x: i32,
    pub y: i32,
}

#[typeshare]
#[derive(Debug, Clone, Deserialize, ToSchema, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct RectangleProperties {
    pub width: f32,
    pub height: f32,
    pub color: String,
    pub fill_pattern: FillPatternType,
    pub stroke_width: f32,
}

#[typeshare]
#[derive(Debug, Clone, Deserialize, ToSchema, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct EllipseProperties {
    pub radius_x: f32,
    pub radius_y: f32,
    pub color: String,
    pub fill_pattern: FillPatternType,
    pub stroke_width: f32,
}

#[typeshare]
#[derive(Debug, Clone, Deserialize, ToSchema, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct FreeLineProperties {
    pub points: Vec<Vec<f32>>,
    pub color: String,
    pub fill_pattern: FillPatternType,
    pub stroke_width: f32,
}

#[typeshare]
#[derive(Debug, Clone, Deserialize, ToSchema, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct PolygonProperties {
    pub points: Vec<Vec<f32>>,
    pub color: String,
    pub fill_pattern: FillPatternType,
    pub stroke_width: f32,
}

#[typeshare]
#[derive(Debug, Clone, Deserialize, ToSchema, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct LabelTextProperties {
    pub text: String,
    pub width: i32,
    pub height: i32,
    pub color: String,
}

#[typeshare]
#[derive(Debug, Clone, Deserialize, ToSchema, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct ImageProperties {
    pub path: String,
}

/// Represents user drawing.
#[typeshare]
#[derive(Debug, Clone, Deserialize, ToSchema, Serialize)]
#[serde(tag = "type", content = "properties")]
pub enum DrawingVariant {
    Rectangle(RectangleProperties),
    Ellipse(EllipseProperties),
    FreeLine(FreeLineProperties),
    BezierPolygon(PolygonProperties),
    LabelText(LabelTextProperties),
    Image(ImageProperties),
}

#[typeshare]
#[derive(Debug, Clone, Deserialize, Serialize)]
pub enum FillPatternType {
    #[serde(rename = "fill")]
    Fill,
    #[serde(rename = "none")]
    None,
    #[serde(rename = "hatchdown")]
    HatchDown,
    #[serde(rename = "hatchup")]
    HatchUp,
    #[serde(rename = "crosshatch")]
    CrossHatch,
    #[serde(rename = "points")]
    Points,
    #[serde(rename = "wave")]
    Wave,
}

/// Used to change the `add_date` of a drawing.
#[typeshare]
#[derive(Debug, Clone, Copy, Serialize, Deserialize, ToSchema)]
#[serde(rename_all = "camelCase")]
pub struct UpdateAddDateDrawingDto {
    /// The id of the drawing.
    pub id: Uuid,
    /// The date the drawing was added to the map.
    /// If None, the drawing always existed.
    pub add_date: Option<NaiveDate>,
}

/// Used to change the `remove_date` of a drawing.
#[typeshare]
#[derive(Debug, Clone, Copy, Serialize, Deserialize, ToSchema)]
#[serde(rename_all = "camelCase")]
pub struct UpdateRemoveDateDrawingDto {
    /// The id of the drawing.
    pub id: Uuid,
    /// The date the drawing was removed from the map.
    /// If None, the drawing is still on the map.
    pub remove_date: Option<NaiveDate>,
}

/// Used to differentiate between different update operations on drawings.
///
/// Ordering of enum variants is important.
/// Serde will try to deserialize starting from the top.
#[typeshare]
#[derive(Debug, Clone, Serialize, Deserialize, ToSchema)]
#[serde(tag = "type", content = "content")]
pub enum UpdateDrawingsDto {
    /// Update the actual drawings data.
    Update(Vec<DrawingDto>),
    /// Change the `add_date` of a drawing.
    UpdateAddDate(Vec<UpdateAddDateDrawingDto>),
    /// Change the `remove_date` of drawings.
    UpdateRemoveDate(Vec<UpdateRemoveDateDrawingDto>),
}
