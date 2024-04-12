//! All entities associated with [`Shading`].

use chrono::NaiveDate;
use diesel::{AsChangeset, Identifiable, Insertable, Queryable};
use postgis_diesel::types::{Point, Polygon};
use uuid::Uuid;

use crate::{model::r#enum::shade::Shade, schema::shadings};

/// The `Shading` entity.
#[derive(Debug, Clone, Identifiable, Queryable, Insertable)]
#[diesel(table_name = shadings)]
pub struct Shading {
    /// The id of the shading.
    pub id: Uuid,
    /// The plant layer the shadings is on.
    pub layer_id: i32,
    /// The type/strength of shade.
    pub shade: Shade,
    /// The position of the shade on the map.
    pub geometry: Polygon<Point>,
    /// The date the shading was added to the map.
    /// If None, the shading always existed.
    pub add_date: Option<NaiveDate>,
    /// The date the shading was removed from the map.
    /// If None, the shading is still on the map.
    pub remove_date: Option<NaiveDate>,
}

/// The `UpdateShading` entity.
#[derive(Debug, Clone, Default, AsChangeset)]
#[diesel(table_name = shadings)]
pub struct UpdateShading {
    /// The id of the shading.
    pub id: Uuid,
    /// The type/strength of shade.
    pub shade: Option<Shade>,
    /// The position of the shade on the map.
    pub geometry: Option<Polygon<Point>>,
    /// The date the shading was added to the map.
    pub add_date: Option<Option<NaiveDate>>,
    /// The date the shading was removed from the map.
    pub remove_date: Option<Option<NaiveDate>>,
}
