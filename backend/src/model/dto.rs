//! DTOs of `PermaplanT`.
#![allow(clippy::module_name_repetitions)] // There needs to be a difference between DTOs and entities otherwise imports will be messy.

use chrono::NaiveDate;
use serde::{Deserialize, Serialize};
use typeshare::typeshare;
use utoipa::{IntoParams, ToSchema};

use super::r#enum::{quality::Quality, quantity::Quantity};

pub mod actions;
pub mod map_impl;
pub mod map_version_impl;
pub mod new_map_impl;
pub mod new_map_version_impl;
pub mod new_seed_impl;
pub mod page_impl;
pub mod plants_impl;
pub mod seed_impl;

/// Contains configuration the frontend needs to run.
#[typeshare]
#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize, ToSchema)]
pub struct ConfigDto {
    /// The base URL of the authorization server
    pub issuer_uri: String,
    /// The client_id the frontend should use to log in
    pub client_id: String,
    /// The version must be an exact match between frontend and backend.
    pub version: i32,
}

#[allow(clippy::missing_docs_in_private_items)] // TODO: See #97.
#[typeshare]
#[derive(Serialize, Deserialize, ToSchema)]
pub struct SeedDto {
    pub id: i32,
    pub name: String,
    pub variety: Option<String>,
    pub plant_id: Option<i32>,
    pub harvest_year: i16,
    pub quantity: Quantity,
    pub use_by: Option<NaiveDate>,
    pub origin: Option<String>,
    pub taste: Option<String>,
    pub yield_: Option<String>,
    pub generation: Option<i16>,
    pub quality: Option<Quality>,
    pub price: Option<i16>,
    pub notes: Option<String>,
}

#[allow(clippy::missing_docs_in_private_items)] // TODO: See #97.
#[typeshare]
#[derive(Serialize, Deserialize, ToSchema)]
pub struct NewSeedDto {
    pub name: String,
    pub variety: Option<String>,
    pub plant_id: Option<i32>,
    pub harvest_year: i16,
    pub quantity: Quantity,
    pub use_by: Option<NaiveDate>,
    pub origin: Option<String>,
    pub taste: Option<String>,
    pub yield_: Option<String>,
    pub generation: Option<i16>,
    pub quality: Option<Quality>,
    pub price: Option<i16>,
    pub notes: Option<String>,
}

/// The essential identifying information of a plant.
#[typeshare]
#[derive(Debug, Serialize, PartialEq, Eq, Deserialize, ToSchema)]
pub struct PlantsSummaryDto {
    /// The plants database id.
    pub id: i32,
    /// Biological name of this plant (E.g. "Triticum aestivum", "Prunus cerasus")
    pub unique_name: String,
    /// A list of common english names (E.g. "Bread wheat", "Sour cherry")
    pub common_name_en: Option<Vec<Option<String>>>,
}

/// Represents plant planted on a map.
/// E.g. a user drags a plant from the search results and drops it on the map.
#[typeshare]
#[derive(Serialize, Deserialize, ToSchema, Clone)]
pub struct PlantLayerObjectDto {
    /// The database id of the record. This is a UUID.
    pub id: String,
    /// The plant that is planted.
    #[serde(rename = "plantId")]
    pub plant_id: i32,
    /// The x coordinate of the position on the map.
    pub x: i32,
    /// The y coordinate of the position on the map.
    pub y: i32,
    /// The width of the plant on the map.
    pub width: i32,
    /// The height of the plant on the map.
    pub height: i32,
    /// The rotation of the plant on the map.
    pub rotation: i32,
    /// The x scale of the plant on the map.
    #[serde(rename = "scaleX")]
    pub scale_x: i32,
    /// The y scale of the plant on the map.
    #[serde(rename = "scaleY")]
    pub scale_y: i32,
}

/// Used to create a new planting.
#[typeshare]
#[derive(Serialize, Deserialize, ToSchema)]
pub struct NewPlantingDto {
    /// The database id of the record. This is a UUID.
    pub id: String,
    /// The plant that is planted.
    pub plant_id: i32,
    /// The the map the plant is placed on.
    pub map_id: i32,
    /// The x coordinate of the position on the map.
    pub x: i32,
    /// The y coordinate of the position on the map.
    pub y: i32,
    /// The width of the plant on the map.
    pub width: i32,
    /// The height of the plant on the map.
    pub height: i32,
    /// The rotation of the plant on the map.
    pub rotation: i32,
    /// The x scale of the plant on the map.
    #[serde(rename = "scaleX")]
    pub scale_x: i32,
    /// The y scale of the plant on the map.
    #[serde(rename = "scaleY")]
    pub scale_y: i32,
}

/// Used to update an existing planting.
#[typeshare]
#[derive(Serialize, Deserialize, ToSchema)]
pub struct UpdatePlantingDto {
    /// The plant that is planted.
    pub plant_id: Option<i32>,
    /// The map the plant is placed on.
    /// Note: This field is not updated by this endpoint.
    pub map_id: Option<i32>,
    /// The x coordinate of the position on the map.
    pub x: Option<i32>,
    /// The y coordinate of the position on the map.
    pub y: Option<i32>,
}

/// Query parameters for searching plantings.
#[typeshare]
#[derive(Debug, Deserialize, IntoParams)]
pub struct PlantingSearchParameters {
    /// The id of the map the planting belongs to.
    pub map_id: Option<i32>,
    /// The id of the plants layer the planting is placed on.
    pub plants_layer_id: Option<i32>,
}

/// Query parameters for searching plants.
#[typeshare]
#[derive(Debug, Deserialize, IntoParams)]
pub struct PlantsSearchParameters {
    /// The system will check if this string occurs in the plants common name or unique name.
    pub name: Option<String>,
}

/// Query parameters for searching seeds.
#[typeshare]
#[derive(Debug, Deserialize, IntoParams)]
pub struct SeedSearchParameters {
    /// Name of the seed to search for.
    pub name: Option<String>,
    /// The exact harvest year of the seed.
    pub harvest_year: Option<i16>,
}

/// Query parameters paginating list endpoints.
#[typeshare]
#[derive(Debug, Deserialize, IntoParams)]
pub struct PageParameters {
    /// Number of results in per page.
    pub per_page: Option<i32>,
    /// Page number to be returned.
    /// Note: pages start at one.
    pub page: Option<i32>,
}

/// A page of results returned from a list endpoint.
#[typeshare]
#[derive(Debug, Serialize, PartialEq, Eq, Deserialize, ToSchema)]
#[aliases(
    PagePlantsSummaryDto = Page<PlantsSummaryDto>,
    PageSeedDto = Page<SeedDto>,
    PageMapDto = Page<MapDto>,
    PagePlantingDto = Page<PlantLayerObjectDto>,
    PageMapVersionDto = Page<MapVersionDto>
)]
pub struct Page<T> {
    /// Resulting records.
    pub results: Vec<T>,
    /// Current page number.
    pub page: i32,
    /// Results per page.
    pub per_page: i32,
    /// Number of pages in total.
    pub total_pages: i32,
}

/// The whole information of a map.
#[typeshare]
#[derive(Serialize, Deserialize, ToSchema)]
pub struct MapDto {
    /// The id of the map.
    pub id: i32,
    /// The name of the map.
    pub name: String,
    /// The date the map was created.
    pub creation_date: NaiveDate,
    /// The date the map is supposed to be deleted.
    pub deletion_date: Option<NaiveDate>,
    /// The date the last time the map view was opened by any user.
    pub last_visit: Option<NaiveDate>,
    /// A flag indicating if this map is marked for deletion.
    pub is_inactive: bool,
    /// The zoom factor of the map.
    pub zoom_factor: i16,
    /// The amount of honors the map received.
    pub honors: i16,
    /// The amount of visits the map had.
    pub visits: i16,
    /// The amount of plants harvested on the map.
    pub harvested: i16,
    /// The id of the owner of the map.
    pub owner_id: i32,
}

/// The information of a map neccessary for its creation.
#[typeshare]
#[derive(Serialize, Deserialize, ToSchema)]
pub struct NewMapDto {
    /// The name of the map.
    pub name: String,
    /// The date the map was created.
    pub creation_date: NaiveDate,
    /// The date the map is supposed to be deleted.
    pub deletion_date: Option<NaiveDate>,
    /// The date the last time the map view was opened by any user.
    pub last_visit: Option<NaiveDate>,
    /// A flag indicating if this map is marked for deletion.
    pub is_inactive: bool,
    /// The zoom factor of the map.
    pub zoom_factor: i16,
    /// The amount of honors the map received.
    pub honors: i16,
    /// The amount of visits the map had.
    pub visits: i16,
    /// The amount of plants harvested on the map.
    pub harvested: i16,
    /// The id of the owner of the map.
    pub owner_id: i32,
}

/// Query parameters for searching maps.
#[typeshare]
#[derive(Debug, Deserialize, IntoParams)]
pub struct MapSearchParameters {
    /// Whether or not the map is active.
    pub is_inactive: Option<bool>,
    /// The owner of the map.
    pub owner_id: Option<i32>,
}

/// The whole information of a map version.
#[typeshare]
#[derive(Serialize, Deserialize, ToSchema)]
pub struct MapVersionDto {
    /// The id of the map version.
    pub id: i32,
    /// The id of the parent map.
    pub map_id: i32,
    /// The name of this version.
    pub version_name: String,
    /// The date this snapshot was taken.
    pub snapshot_date: NaiveDate,
}

/// The information of a map version neccessary for its creation.
#[typeshare]
#[derive(Serialize, Deserialize, ToSchema)]
pub struct NewMapVersionDto {
    /// The id of the parent map.
    pub map_id: i32,
    /// The name of this version.
    pub version_name: String,
    /// The date this snapshot was taken.
    pub snapshot_date: NaiveDate,
}

/// Query parameters for searching map versions.
#[typeshare]
#[derive(Debug, Deserialize, IntoParams)]
pub struct MapVersionSearchParameters {
    /// Whether or not the map is active.
    pub map_id: Option<i32>,
}
