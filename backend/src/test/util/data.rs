//! Dummy-Data for tests.

use chrono::{NaiveDate, NaiveDateTime};
use diesel::Insertable;
use postgis_diesel::types::{Point, Polygon};
use uuid::Uuid;

use lib_db::model::r#enum::{layer_type::LayerType, privacy_option::PrivacyOption};

use super::dummy_map_polygons::tall_rectangle;

#[derive(Insertable)]
#[diesel(table_name = crate::schema::maps)]
pub struct TestInsertableMap {
    pub id: i32,
    pub name: String,
    pub deletion_date: Option<NaiveDate>,
    pub last_visit: Option<NaiveDate>,
    pub is_inactive: bool,
    pub zoom_factor: i16,
    pub honors: i16,
    pub visits: i16,
    pub harvested: i16,
    pub privacy: PrivacyOption,
    pub description: Option<String>,
    pub location: Option<Point>,
    pub created_by: Uuid,
    pub geometry: Polygon<Point>,
    pub created_at: NaiveDateTime,
    pub modified_at: NaiveDateTime,
    pub modified_by: Uuid,
}

impl Default for TestInsertableMap {
    fn default() -> Self {
        Self {
            id: -1,
            name: "Test Map 1".to_owned(),
            is_inactive: false,
            zoom_factor: 100,
            honors: 0,
            visits: 0,
            harvested: 0,
            privacy: PrivacyOption::Public,
            created_by: Uuid::default(),
            modified_by: Uuid::default(),
            geometry: tall_rectangle(),
            deletion_date: NaiveDate::from_ymd_opt(2000, 1, 1),
            last_visit: NaiveDate::from_ymd_opt(2000, 1, 1),
            description: Some(String::new()),
            location: None,
            created_at: NaiveDate::from_ymd_opt(2016, 7, 8)
                .unwrap()
                .and_hms_opt(9, 10, 11)
                .unwrap(),
            modified_at: NaiveDate::from_ymd_opt(2016, 7, 8)
                .unwrap()
                .and_hms_opt(9, 10, 11)
                .unwrap(),
        }
    }
}
#[derive(Insertable)]
#[diesel(table_name = crate::schema::layers)]
pub struct TestInsertableLayer {
    pub id: i32,
    pub map_id: i32,
    pub type_: LayerType,
    pub name: String,
    pub is_alternative: bool,
}

impl Default for TestInsertableLayer {
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
#[diesel(table_name = crate::schema::plants)]
pub struct TestInsertablePlant {
    pub id: i32,
    pub unique_name: String,
    pub common_name_en: Option<Vec<Option<String>>>,
}

impl Default for TestInsertablePlant {
    fn default() -> Self {
        Self {
            id: -1,
            unique_name: "Test Plant 1".to_owned(),
            common_name_en: Some(vec![Some("Testplant".to_owned())]),
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
    pub seed_id: Option<i32>,
    pub is_area: bool,
    pub notes: String,
    pub created_at: NaiveDateTime,
    pub modified_at: NaiveDateTime,
    pub created_by: Uuid,
    pub modified_by: Uuid,
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
            seed_id: None,
            is_area: false,
            notes: String::new(),
            created_at: NaiveDate::from_ymd_opt(2016, 7, 8)
                .unwrap()
                .and_hms_opt(9, 10, 11)
                .unwrap(),
            modified_at: NaiveDate::from_ymd_opt(2016, 7, 8)
                .unwrap()
                .and_hms_opt(9, 10, 11)
                .unwrap(),
            created_by: Uuid::default(),
            modified_by: Uuid::default(),
        }
    }
}
