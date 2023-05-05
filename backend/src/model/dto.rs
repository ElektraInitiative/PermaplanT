//! DTOs of `PermaplanT`.
#![allow(clippy::module_name_repetitions)] // There needs to be a difference between DTOs and entities otherwise imports will be messy.

use chrono::NaiveDate;
use serde::{Deserialize, Serialize};
use typeshare::typeshare;
use utoipa::{IntoParams, ToSchema};

use super::r#enum::{quality::Quality, quantity::Quantity};

pub mod map_impl;
pub mod map_version_impl;
pub mod new_map_impl;
pub mod new_map_version_impl;
pub mod new_seed_impl;
pub mod page_impl;
pub mod plants_impl;
pub mod seed_impl;

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
#[derive(Serialize, Deserialize, ToSchema)]
pub struct PlantingDto {
    /// The database id of the record.
    pub id: i32,
    /// The plant that is planted.
    pub plant_id: i32,
    /// The plant layer of the map the plant is placed on.
    /// NOTE:
    ///     could be replaced by a `map_id` as the relation between `maps` and
    ///     `plants_layers` should be non-nullable and one to one.
    pub plants_layer_id: i32,
    /// The x coordinate of the position on the map.
    pub x: i32,
    /// The y coordinate of the position on the map.
    pub y: i32,
}

/// Used to create a new planting.
#[typeshare]
#[derive(Serialize, Deserialize, ToSchema)]
pub struct NewPlantingDto {
    /// The plant that is planted.
    pub plant_id: i32,
    /// The plant layer of the map the plant is placed on.
    /// NOTE:
    ///     could be replaced by a `map_id` as the relation between `maps` and
    ///     `plants_layers` should be non-nullable and one to one.
    pub plants_layer_id: i32,
    /// The x coordinate of the position on the map.
    pub x: i32,
    /// The y coordinate of the position on the map.
    pub y: i32,
}

/// Used to update an existing planting.
#[typeshare]
#[derive(Serialize, Deserialize, ToSchema)]
pub struct UpdatePlantingDto {
    /// The plant that is planted.
    pub plant_id: Option<i32>,
    /// The plant layer of the map the plant is placed on.
    /// NOTE:
    ///     could be replaced by a `map_id` as the relation between `maps` and
    ///     `plants_layers` should be non-nullable and one to one.
    pub plants_layer_id: Option<i32>,
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
    PagePlantingDto = Page<PlantingDto>,
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

#[allow(clippy::missing_docs_in_private_items)] // TODO: See #97.
#[typeshare]
#[derive(Serialize, Deserialize, ToSchema)]
pub struct MapDto {
    pub id: i32,
    pub name: String,
    pub creation_date: NaiveDate,
    pub deletion_date: Option<NaiveDate>,
    pub last_visit: Option<NaiveDate>,
    pub is_inactive: bool,
    pub zoom_factor: i16,
    pub honors: i16,
    pub visits: i16,
    pub harvested: i16,
    pub owner_id: i32,
}

#[allow(clippy::missing_docs_in_private_items)] // TODO: See #97.
#[typeshare]
#[derive(Serialize, Deserialize, ToSchema)]
pub struct NewMapDto {
    pub name: String,
    pub creation_date: NaiveDate,
    pub deletion_date: Option<NaiveDate>,
    pub last_visit: Option<NaiveDate>,
    pub is_inactive: bool,
    pub zoom_factor: i16,
    pub honors: i16,
    pub visits: i16,
    pub harvested: i16,
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

#[allow(clippy::missing_docs_in_private_items)] // TODO: See #97.
#[typeshare]
#[derive(Serialize, Deserialize, ToSchema)]
pub struct MapVersionDto {
    pub id: i32,
    pub map_id: i32,
    pub version_name: String,
    pub snapshot_date: NaiveDate,
}

#[allow(clippy::missing_docs_in_private_items)] // TODO: See #97.
#[typeshare]
#[derive(Serialize, Deserialize, ToSchema)]
pub struct NewMapVersionDto {
    pub map_id: i32,
    pub version_name: String,
    pub snapshot_date: NaiveDate,
}

/// Query parameters for searching map versions.
#[typeshare]
#[derive(Debug, Deserialize, IntoParams)]
pub struct MapVersionSearchParameters {
    /// Whether or not the map is active.
    pub map_id: Option<i32>,
}
