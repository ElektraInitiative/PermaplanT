//! DTOs of `PermaplanT`.
#![allow(clippy::module_name_repetitions)] // There needs to be a difference between DTOs and entities otherwise imports will be messy.

use chrono::NaiveDate;
use serde::{Deserialize, Serialize};
use typeshare::typeshare;
use utoipa::ToSchema;

use super::r#enum::{
    deciduous_or_evergreen::DeciduousOrEvergreen, fertility::Fertility, flower_type::FlowerType,
    growth_rate::GrowthRate, herbaceous_or_woody::HerbaceousOrWoody, life_cycle::LifeCycle,
    nutrition_demand::NutritionDemand, quality::Quality, quantity::Quantity,
    root_zone_tendancy::RootZoneTendancy, shade::Shade, soil_ph::SoilPh, soil_texture::SoilTexture,
    soil_water_retention::SoilWaterRetention, sun::Sun, water::Water,
};

pub mod new_seed_impl;
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

#[allow(clippy::missing_docs_in_private_items)] // TODO: See #97.
#[typeshare]
#[derive(Serialize, Deserialize, ToSchema)]
pub struct PlantsDto {
    pub id: i32,
    pub tags: Vec<Option<String>>,
    pub species: String,
    pub plant: Option<String>,
    pub plant_type: Option<i32>,
}

#[typeshare]
#[derive(Serialize, Deserialize, ToSchema)]
pub struct PlantDetailDto {
    pub id: i32,
    pub binomial_name: String,
    pub common_name: Vec<Option<String>>,
    pub common_name_de: Vec<Option<String>>,
    pub family: Option<String>,
    pub subfamily: Option<String>,
    pub genus: Option<String>,
    pub edible_uses: Option<String>,
    pub medicinal_uses: Option<String>,
    pub material_uses_and_functions: Option<String>,
    pub botanic: Option<String>,
    pub propagation: Option<String>,
    pub cultivation: Option<String>,
    pub environment: Option<String>,
    pub material_uses: Option<String>,
    pub functions: Option<String>,
    pub provides_forage_for: Option<String>,
    pub provides_shelter_for: Option<String>,
    pub hardiness_zone: Option<i16>,
    pub heat_zone: Option<i16>,
    pub water: Option<Water>,
    pub sun: Option<Sun>,
    pub shade: Vec<Option<Shade>>,
    pub soil_ph: Vec<Option<SoilPh>>,
    pub soil_texture: Vec<Option<SoilTexture>>,
    pub soil_water_retention: Vec<Option<SoilWaterRetention>>,
    pub environmental_tolerances: Vec<Option<String>>,
    pub native_climate_zones: Option<String>,
    pub adapted_climate_zones: Option<String>,
    pub native_geographical_range: Option<String>,
    pub native_environment: Option<String>,
    pub ecosystem_niche: Option<String>,
    pub root_zone_tendancy: Option<RootZoneTendancy>,
    pub deciduous_or_evergreen: Option<DeciduousOrEvergreen>,
    pub herbaceous_or_woody: Option<HerbaceousOrWoody>,
    pub life_cycle: Vec<Option<LifeCycle>>,
    pub growth_rate: Option<GrowthRate>,
    pub mature_size_height: Option<String>,
    pub mature_size_width: Option<String>,
    pub fertility: Vec<Option<Fertility>>,
    pub pollinators: Option<String>,
    pub flower_colour: Option<String>,
    pub flower_type: Option<FlowerType>,
    pub created_at: NaiveDateTime,
    pub updated_at: NaiveDateTime,
    pub has_drought_tolerance: bool,
    pub tolerates_wind: bool,
    pub plant_references: Vec<Option<String>>,
    pub is_tree: bool,
    pub nutrition_demand: Option<NutritionDemand>,
    pub preferable_permaculture_zone: Option<i16>,
}
