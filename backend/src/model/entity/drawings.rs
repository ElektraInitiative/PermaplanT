use chrono::NaiveDate;
use diesel::{AsChangeset, Identifiable, Insertable, Queryable};
use uuid::Uuid;

use crate::model::r#enum::drawing_shape_type::DrawingShapeType;
use crate::schema::drawings;

#[derive(Debug, Clone, Identifiable, Queryable, Insertable)]
#[diesel(table_name = drawings)]
pub struct Drawing {
    pub id: Uuid,
    pub shape_type: DrawingShapeType,
    pub layer_id: i32,
    pub add_date: Option<NaiveDate>,
    pub remove_date: Option<NaiveDate>,
    pub rotation: f32,
    pub scale_x: f32,
    pub scale_y: f32,
    pub x: i32,
    pub y: i32,
    pub color: String,
    pub stroke_width: f32,
    pub properties: serde_json::Value,
    pub fill_pattern: String,
}

#[derive(Debug, Clone, Default, AsChangeset)]
#[diesel(table_name = drawings)]
pub struct UpdateDrawing {
    pub id: Uuid,
    pub shape_type: Option<DrawingShapeType>,
    pub layer_id: Option<i32>,
    pub add_date: Option<Option<NaiveDate>>,
    pub remove_date: Option<Option<NaiveDate>>,
    pub rotation: Option<f32>,
    pub scale_x: Option<f32>,
    pub scale_y: Option<f32>,
    pub x: Option<i32>,
    pub y: Option<i32>,
    pub color: Option<String>,
    pub stroke_width: Option<f32>,
    pub properties: Option<serde_json::Value>,
    pub fill_pattern: Option<String>,
}
