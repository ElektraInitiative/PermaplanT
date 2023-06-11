use diesel::{AsChangeset, Identifiable, Insertable, Queryable};

use crate::schema::plantings;

/// The `Planting` entity.
#[derive(Debug, Clone, Identifiable, Queryable)]
#[diesel(table_name = plantings)]
pub struct Planting {
    /// The database id of the record.
    pub id: i32,
    /// The plant that is planted.
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
}

/// The `Planting` entity.
#[derive(Debug, Clone, Insertable)]
#[diesel(table_name = plantings)]
pub struct NewPlanting {
    /// The plant that is planted.
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
}

/// The `Planting` entity.
#[derive(Debug, Clone, AsChangeset)]
#[diesel(table_name = plantings)]
pub struct UpdatePlanting {
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
    pub scale_x: Option<f32>,
    /// The y scale of the plant on the map.
    pub scale_y: Option<f32>,
}
