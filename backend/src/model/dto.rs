//! DTOs of `PermaplanT`.
#![allow(clippy::module_name_repetitions)] // There needs to be a difference between DTOs and entities otherwise imports will be messy.

use chrono::NaiveDate;
use serde::{Deserialize, Serialize};
use typeshare::typeshare;
use utoipa::{IntoParams, ToSchema};

use super::r#enum::{quality::Quality, quantity::Quantity};

pub mod base_layers_impl;
pub mod new_base_layers_impl;
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
    pub binomial_name: String,
    /// A list of common english names (E.g. "Bread wheat", "Sour cherry")
    pub common_name: Option<Vec<Option<String>>>,
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
#[aliases(PagePlantsSummaryDto = Page<PlantsSummaryDto>, PageSeedDto = Page<SeedDto>)]
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

/// Contains all data that is necessary to display a maps base layer.
#[typeshare]
#[derive(Debug, Serialize, PartialEq, Deserialize, ToSchema)]
pub struct BaseLayerDto {
    /// Primary key, is incremented for each new layer.
    pub id: i32,
    /// Indicates where the image is stored in Nextcloud.
    pub base_image_url: String,
    /// Conversion factor from image pixels to real world distances.
    pub pixels_per_meter: f64,
    /// the amount of rotation required to align the base image with geographical north.
    pub north_orientation_degrees: f64,
}

/// Information for storing a new base layer
#[typeshare]
#[derive(Debug, Serialize, PartialEq, Deserialize, ToSchema)]
pub struct NewBaseLayerDto {
    /// Indicates where the image is stored in Nextcloud.
    pub base_image_url: String,
    /// Conversion factor from image pixels to real world distances.
    pub pixels_per_meter: f64,
    /// the amount of rotation required to align the base image with geographical north.
    pub north_orientation_degrees: f64,
}