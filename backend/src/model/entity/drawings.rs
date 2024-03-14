use chrono::NaiveDate;
use diesel::{AsChangeset, Identifiable, Insertable, Queryable};
use uuid::Uuid;

use crate::model::r#enum::drawing_shape_kind::DrawingShapeKind;
use crate::schema::drawings;

#[derive(Debug, Clone, Identifiable, Queryable, Insertable, AsChangeset)]
#[diesel(table_name = drawings)]
pub struct Drawing {
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
