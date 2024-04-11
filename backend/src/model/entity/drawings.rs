use chrono::NaiveDate;
use diesel::{AsChangeset, Identifiable, Insertable, Queryable};
use serde_json;
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
    pub properties: serde_json::Value,
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
    pub properties: Option<serde_json::Value>,
}
