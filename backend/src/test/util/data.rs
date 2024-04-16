//! Dummy-Data for tests.

use chrono::NaiveDate;
use diesel::Insertable;
use postgis_diesel::types::{Point, Polygon};
use uuid::Uuid;

use crate::model::r#enum::{layer_type::LayerType, privacy_option::PrivacyOption, shade::Shade};

use super::dummy_map_polygons::{small_rectangle, tall_rectangle};

#[derive(Insertable)]
#[diesel(table_name = crate::schema::maps)]
pub struct TestInsertableMap {
    pub id: i32,
    pub name: String,
    pub creation_date: NaiveDate,
    pub is_inactive: bool,
    pub zoom_factor: i16,
    pub honors: i16,
    pub visits: i16,
    pub harvested: i16,
    pub privacy: PrivacyOption,
    pub owner_id: Uuid,
    pub geometry: Polygon<Point>,
}

impl Default for TestInsertableMap {
    fn default() -> Self {
        Self {
            id: -1,
            name: "Test Map 1".to_owned(),
            creation_date: NaiveDate::from_ymd_opt(2023, 5, 8).expect("Could not parse date!"),
            is_inactive: false,
            zoom_factor: 100,
            honors: 0,
            visits: 0,
            harvested: 0,
            privacy: PrivacyOption::Public,
            owner_id: Uuid::default(),
            geometry: tall_rectangle(),
        }
    }
}

#[derive(Insertable)]
#[diesel(table_name = crate::schema::layers)]
pub struct TestInsertablePlantLayer {
    pub id: i32,
    pub map_id: i32,
    pub type_: LayerType,
    pub name: String,
    pub is_alternative: bool,
}

impl Default for TestInsertablePlantLayer {
    fn default() -> Self {
        Self {
            id: -1,
            map_id: -1,
            type_: LayerType::Plants,
            name: "Test Layer 1".to_owned(),
            is_alternative: false,
        }
    }
}

#[derive(Insertable)]
#[diesel(table_name = crate::schema::layers)]
pub struct TestInsertableShadeLayer {
    pub id: i32,
    pub map_id: i32,
    pub type_: LayerType,
    pub name: String,
    pub is_alternative: bool,
}

impl Default for TestInsertableShadeLayer {
    fn default() -> Self {
        Self {
            id: -1,
            map_id: -1,
            type_: LayerType::Shade,
            name: "Test Layer 1".to_owned(),
            is_alternative: false,
        }
    }
}

#[derive(Insertable)]
#[diesel(table_name = crate::schema::plants)]
pub struct TestInsertablePlant {
    pub id: i32,
    pub unique_name: String,
    pub common_name_en: Option<Vec<Option<String>>>,
    pub common_name_de: Option<Vec<Option<String>>>,
}

impl Default for TestInsertablePlant {
    fn default() -> Self {
        Self {
            id: -1,
            unique_name: "Test Plant 1".to_owned(),
            common_name_en: Some(vec![Some("Testplant".to_owned())]),
            common_name_de: Some(vec![Some("Testpflanze".to_owned())]),
        }
    }
}

#[derive(Insertable)]
#[diesel(table_name = crate::schema::plantings)]
pub struct TestInsertablePlanting {
    pub id: Uuid,
    pub layer_id: i32,
    pub plant_id: i32,
    pub x: i32,
    pub y: i32,
    pub size_x: i32,
    pub size_y: i32,
    pub rotation: f32,
    pub add_date: Option<NaiveDate>,
    pub remove_date: Option<NaiveDate>,
}

impl Default for TestInsertablePlanting {
    fn default() -> Self {
        Self {
            id: Uuid::default(),
            layer_id: -1,
            plant_id: -1,
            x: 0,
            y: 0,
            size_x: 0,
            size_y: 0,
            rotation: 0.0,
            add_date: None,
            remove_date: None,
        }
    }
}

#[derive(Insertable)]
#[diesel(table_name = crate::schema::shadings)]
pub struct TestInsertableShading {
    pub id: Uuid,
    pub layer_id: i32,
    pub shade: Shade,
    pub geometry: Polygon<Point>,
    pub add_date: Option<NaiveDate>,
    pub remove_date: Option<NaiveDate>,
}

impl Default for TestInsertableShading {
    fn default() -> Self {
        Self {
            id: Uuid::default(),
            layer_id: -1,
            shade: Shade::NoShade,
            geometry: small_rectangle(),
            add_date: None,
            remove_date: None,
        }
    }
}
