//! All entities associated with [`Planting`].

use chrono::NaiveDate;
use diesel::{AsChangeset, Identifiable, Insertable, Queryable};
use uuid::Uuid;

use crate::schema::plantings;

/// The `Planting` entity.
#[derive(Debug, Clone, Identifiable, Queryable, Insertable)]
#[diesel(table_name = plantings)]
pub struct Planting {
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
    /// The size of the planting on the map in x direction.
    pub size_x: i32,
    /// The size of the planting on the map in y direction.
    pub size_y: i32,
    /// The rotation in degrees (0-360) of the plant on the map.
    pub rotation: f32,
    /// The date the planting was added to the map.
    /// If None, the planting always existed.
    pub add_date: Option<NaiveDate>,
    /// The date the planting was removed from the map.
    /// If None, the planting is still on the map.
    pub remove_date: Option<NaiveDate>,
    /// Plantings may be linked with a seed.
    pub seed_id: Option<i32>,
    /// Is the planting an area of plants.
    pub is_area: bool,
    /*
    /// The date the planting was created.
    //pub create_date: NaiveDate,

    /// The date the planting was 'soft' deleted
    /// and is still able to be restored.
    //pub delete_date: Option<NaiveDate>,
    */
    /// Notes about the planting in Markdown.
    pub notes: Option<String>,
}

/// The `UpdatePlanting` entity.
#[derive(Debug, Clone, Default, AsChangeset)]
#[diesel(table_name = plantings)]
pub struct UpdatePlanting {
    /// The id of the planting.
    /// This is not updated.
    pub id: Uuid,
    /// The x coordinate of the position on the map.
    pub x: Option<i32>,
    /// The y coordinate of the position on the map.
    pub y: Option<i32>,
    /// The size of the planting on the map in x direction.
    pub size_x: Option<i32>,
    /// The size of the planting on the map in y direction.
    pub size_y: Option<i32>,
    /// The rotation of the plant on the map.
    pub rotation: Option<f32>,
    /// The date the planting was added to the map.
    pub add_date: Option<Option<NaiveDate>>,
    /// The date the planting was removed from the map.
    pub remove_date: Option<Option<NaiveDate>>,
    /// Plantings may be linked with a seed.
    pub seed_id: Option<i32>,
    /// Notes about the planting in Markdown.
    pub notes: Option<String>,
}
