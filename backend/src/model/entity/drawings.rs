use chrono::NaiveDate;
use diesel::{AsChangeset, Identifiable, Insertable, Queryable};
use uuid::Uuid;

use crate::{
    model::r#enum::drawing_shape_type::DrawingShapeType,
    schema::{
        drawings, ellipse_drawings, freeline_drawings, image_drawings, labeltext_drawings,
        rectangle_drawings,
    },
};

#[derive(Debug, Clone, Identifiable, Queryable, Insertable)]
#[diesel(table_name = drawings)]
pub struct Drawing {
    pub id: Uuid,
    pub layer_id: i32,
    pub shape_type: DrawingShapeType,
    pub properties_id: Uuid,
    pub add_date: Option<NaiveDate>,
    pub remove_date: Option<NaiveDate>,
    pub rotation: f32,
    pub scale_x: f32,
    pub scale_y: f32,
    pub x: i32,
    pub y: i32,
}

#[derive(Debug, Clone, Default, AsChangeset)]
#[diesel(table_name = drawings)]
pub struct UpdateDrawing {
    pub id: Uuid,
    pub layer_id: i32,
    pub shape_type: DrawingShapeType,
    pub add_date: Option<Option<NaiveDate>>,
    pub remove_date: Option<Option<NaiveDate>>,
    pub rotation: Option<f32>,
    pub scale_x: Option<f32>,
    pub scale_y: Option<f32>,
    pub x: Option<i32>,
    pub y: Option<i32>,
}

#[derive(Debug, Clone, Identifiable, Queryable, Insertable)]
#[diesel(table_name = rectangle_drawings)]
pub struct RectangleDrawing {
    pub id: Uuid,
    pub width: Option<f64>,
    pub height: Option<f64>,
    pub color: Option<String>,
    pub fill_pattern: Option<String>,
    pub stroke_width: Option<f64>,
}

#[derive(Debug, Clone, Identifiable, Queryable, Insertable)]
#[diesel(table_name = ellipse_drawings)]
pub struct EllipseDrawing {
    pub id: Uuid,
    pub radius_x: Option<f64>,
    pub radius_y: Option<f64>,
    pub color: Option<String>,
    pub fill_pattern: Option<String>,
    pub stroke_width: Option<f64>,
}

#[derive(Debug, Clone, Identifiable, Queryable, Insertable)]
#[diesel(table_name = freeline_drawings)]
pub struct FreelineDrawing {
    pub id: Uuid,
    pub points: Option<serde_json::Value>,
    pub color: Option<String>,
    pub fill_pattern: Option<String>,
    pub stroke_width: Option<f64>,
}

#[derive(Debug, Clone, Identifiable, Queryable, Insertable)]
#[diesel(table_name = freeline_drawings)]
pub struct PolygonDrawing {
    pub id: Uuid,
    pub points: Option<serde_json::Value>,
    pub color: Option<String>,
    pub fill_pattern: Option<String>,
    pub stroke_width: Option<f64>,
}

#[derive(Debug, Clone, Identifiable, Queryable, Insertable)]
#[diesel(table_name = labeltext_drawings)]
pub struct LabeltextDrawing {
    pub id: Uuid,
    pub text: Option<String>,
    pub width: Option<i32>,
    pub height: Option<i32>,
    pub color: Option<String>,
}

#[derive(Debug, Clone, Identifiable, Queryable, Insertable)]
#[diesel(table_name = image_drawings)]
pub struct ImageDrawing {
    pub id: Uuid,
    pub path: Option<String>,
}

#[derive(Debug, Queryable)]
pub struct DrawingJoined {
    pub drawing: Drawing,
    pub rectangle_drawing: Option<RectangleDrawing>,
    pub ellipse_drawing: Option<EllipseDrawing>,
    pub freeline_drawing: Option<FreelineDrawing>,
    pub polygon_drawing: Option<PolygonDrawing>,
    pub labeltext_drawing: Option<LabeltextDrawing>,
    pub image_drawing: Option<ImageDrawing>,
}
