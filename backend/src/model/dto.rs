//! DTOs of `PermaplanT`.
#![allow(clippy::module_name_repetitions)] // There needs to be a difference between DTOs and entities otherwise imports will be messy.

use chrono::NaiveDate;
use serde::{Deserialize, Serialize};
use typeshare::typeshare;
use utoipa::{IntoParams, ToSchema};
use uuid::Uuid;

use self::plantings::PlantingDto;

use super::r#enum::{
    layer_type::LayerType, privacy_options::PrivacyOptions, quality::Quality, quantity::Quantity,
    relation_type::RelationType,
};

pub mod actions;
pub mod coordinates_impl;
pub mod layer_impl;
pub mod map_impl;
pub mod new_layer_impl;
pub mod new_map_impl;
pub mod new_seed_impl;
pub mod page_impl;
pub mod plantings;
pub mod plantings_impl;
pub mod plants_impl;
pub mod seed_impl;
pub mod update_map_impl;

/// Contains configuration the frontend needs to run.
#[typeshare]
#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize, ToSchema)]
pub struct ConfigDto {
    /// The base URL of the authorization server
    pub issuer_uri: String,
    /// The client_id the frontend should use to log in
    pub client_id: String,
    /// The version must be an exact match between frontend and backend.
    pub version: String,
}

/// Represents seeds of a user.
#[typeshare]
#[derive(Serialize, Deserialize, ToSchema)]
pub struct SeedDto {
    /// The record id of the seed.
    pub id: i32,
    /// An additional name for the seed.
    pub name: String,
    /// The variety of the seed. Currently unused.
    pub variety: Option<String>,
    /// The id of the plant this seed belongs to.
    pub plant_id: Option<i32>,
    /// When the seeds were harvested.
    pub harvest_year: i16,
    /// How many seeds there are.
    pub quantity: Quantity,
    /// When the seeds should be used by.
    pub use_by: Option<NaiveDate>,
    /// Where the seeds came from.
    pub origin: Option<String>,
    /// What the seeds taste like.
    pub taste: Option<String>,
    /// The yield of the seeds.
    pub yield_: Option<String>,
    /// How many generations the seeds have been grown.
    pub generation: Option<i16>,
    /// The quality of the seeds.
    pub quality: Option<Quality>,
    /// How much the seeds cost.
    pub price: Option<i16>,
    /// Notes about the seeds.
    pub notes: Option<String>,
    /// The id of the owner of the seed.
    pub owner_id: Uuid,
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
    //TODO: add icon_path: String
}

/// Query parameters for searching plants.
#[typeshare]
#[derive(Debug, Deserialize, IntoParams)]
pub struct PlantsSearchParameters {
    /// The system will check if this string occurs in the plants common name or unique name.
    pub name: Option<String>,
}

/// Query parameters for searching plant relations.
#[typeshare]
#[derive(Debug, Deserialize, IntoParams)]
pub struct RelationSearchParameters {
    /// The id of the plant to find relations for.
    pub plant_id: i32,
}

/// Use to return all relations for the plant.
#[typeshare]
#[derive(Debug, Clone, Serialize, Deserialize, ToSchema)]
pub struct RelationsDto {
    /// The id of the plant in the relation.
    pub id: i32,
    /// The type of relation.
    pub relations: Vec<RelationDto>,
}

/// Use to return a relation.
#[typeshare]
#[derive(Debug, Clone, Serialize, Deserialize, ToSchema)]
pub struct RelationDto {
    /// The id of the plant in the relation.
    pub id: i32,
    /// The type of relation.
    pub relation: RelationType,
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
    PageLayerDto = Page<LayerDto>
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

/// A page of results bounded by time.
#[typeshare]
#[derive(Debug, Serialize, Deserialize, ToSchema)]
#[aliases(
    TimelinePagePlantingsDto = TimelinePage<PlantingDto>,
)]
pub struct TimelinePage<T> {
    /// Resulting records.
    pub results: Vec<T>,
    /// The time frame start date.
    pub from: NaiveDate,
    /// The time frame end date.
    pub to: NaiveDate,
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
    /// An enum indicating if this map is private or not.
    pub privacy: PrivacyOptions,
    /// The description of the map.
    pub description: Option<String>,
    /// The location of the map as a latitude/longitude point.
    pub location: Option<Coordinates>,
    /// The id of the owner of the map.
    pub owner_id: Uuid,
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
    /// An enum indicating if this map is private or not.
    pub privacy: PrivacyOptions,
    /// The description of the map.
    pub description: Option<String>,
    /// The location of the map as a latitude/longitude point.
    pub location: Option<Coordinates>,
}

/// The information for updating a map.
#[typeshare]
#[derive(Debug, Clone, Serialize, Deserialize, ToSchema)]
pub struct UpdateMapDto {
    /// The name of the map.
    pub name: Option<String>,
    /// An enum indicating if this map is private or not.
    pub privacy: Option<PrivacyOptions>,
    /// The description of the map.
    pub description: Option<String>,
    /// The location of the map as a latitude/longitude point.
    pub location: Option<Coordinates>,
}

/// Query parameters for searching maps.
#[typeshare]
#[derive(Debug, Deserialize, IntoParams)]
pub struct MapSearchParameters {
    /// Name of the map to search for.
    pub name: Option<String>,
    /// Whether or not the map is active.
    pub is_inactive: Option<bool>,
    /// The owner of the map.
    pub owner_id: Option<Uuid>,
    /// The selected privacy of the map.
    pub privacy: Option<PrivacyOptions>,
}

/// Support struct for transmitting latitude/longitude coordinates.
#[typeshare]
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Coordinates {
    /// Latitude of the point.
    pub latitude: f64,
    /// Longitude of the point.
    pub longitude: f64,
}

/// The whole information of a map version.
#[typeshare]
#[derive(Serialize, Deserialize, ToSchema)]
pub struct LayerDto {
    /// The id of the layer.
    pub id: i32,
    /// The id of the map this layer belongs to.
    pub map_id: i32,
    /// The type of layer.
    pub type_: LayerType,
    /// The name of the layer.
    pub name: String,
    /// A flag indicating if this layer is an user created alternative.
    pub is_alternative: bool,
}

/// The information of a layer neccessary for its creation.
#[typeshare]
#[derive(Serialize, Deserialize, ToSchema)]
pub struct NewLayerDto {
    /// The id of the map this layer belongs to.
    pub map_id: i32,
    /// The type of layer.
    pub type_: LayerType,
    /// The name of the layer.
    pub name: String,
    /// A flag indicating if this layer is an user created alternative.
    pub is_alternative: bool,
}

/// Query parameters for searching layers.
#[typeshare]
#[derive(Debug, Deserialize, IntoParams)]
pub struct LayerSearchParameters {
    /// The parent map.
    pub map_id: Option<i32>,
    /// The type of layer.
    pub type_: Option<LayerType>,
    /// Whether or not the layer is an alternative.
    pub is_alternative: Option<bool>,
}

/// Query parameters for connecting to a map.
#[typeshare]
#[derive(Debug, Deserialize, IntoParams)]
pub struct ConnectToMapQueryParams {
    /// The id of the map to connect to.
    pub map_id: i32,
    /// The id of the user connecting to the map.
    pub user_id: String,
}

/// Search parameters for plant suggestions.
#[typeshare]
#[derive(Debug, Deserialize, IntoParams)]
pub struct PlantSuggestionsSearchParameters {
    /// The kind of suggestion returned by the endpoint.
    #[param(inline)]
    pub suggestion_type: SuggestionType,
    /// Date representing the season to search for.
    /// Only the month and day are used, nevertheless it must be an existing date.
    pub relative_to_date: NaiveDate,
}

/// Kind of suggestion.
#[typeshare]
#[derive(Debug, Deserialize, ToSchema)]
#[serde(rename_all = "lowercase")]
pub enum SuggestionType {
    /// Suggests plants that are available for planting.
    Available,
    /// Suggests plants based on diversity criteria.
    Diversity,
}
