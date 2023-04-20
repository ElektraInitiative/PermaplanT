//! Contains all entities used in `PermaplanT`.

pub mod plants_impl;
pub mod seed_impl;
pub mod base_layers_impl;

use chrono::NaiveDate;
use chrono::NaiveDateTime;

use diesel::{Identifiable, Insertable, Queryable};

use crate::schema::{base_layers, plants, seeds};

use super::r#enum::{
    deciduous_or_evergreen::DeciduousOrEvergreen, fertility::Fertility, flower_type::FlowerType,
    growth_rate::GrowthRate, herbaceous_or_woody::HerbaceousOrWoody, life_cycle::LifeCycle,
    nutrition_demand::NutritionDemand, quality::Quality, quantity::Quantity,
    root_zone_tendancy::RootZoneTendancy, soil_ph::SoilPh, soil_texture::SoilTexture,
    soil_water_retention::SoilWaterRetention, sun::Sun, water::Water,
};

/// The `Plants` entity.
#[allow(clippy::missing_docs_in_private_items)] // TODO: See #97.
#[derive(Identifiable, Queryable)]
#[diesel(table_name = plants)]
pub struct Plants {
    pub id: i32,
    pub binomial_name: String,
    pub common_name: Option<Vec<Option<String>>>,
    pub common_name_de: Option<Vec<Option<String>>>,
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
    pub shade: Option<String>,
    pub soil_ph: Option<Vec<Option<SoilPh>>>,
    pub soil_texture: Option<Vec<Option<SoilTexture>>>,
    pub soil_water_retention: Option<Vec<Option<SoilWaterRetention>>>,
    pub environmental_tolerances: Option<Vec<Option<String>>>,
    pub native_climate_zones: Option<String>,
    pub adapted_climate_zones: Option<String>,
    pub native_geographical_range: Option<String>,
    pub native_environment: Option<String>,
    pub ecosystem_niche: Option<String>,
    pub root_zone_tendancy: Option<RootZoneTendancy>,
    pub deciduous_or_evergreen: Option<DeciduousOrEvergreen>,
    pub herbaceous_or_woody: Option<HerbaceousOrWoody>,
    pub life_cycle: Option<Vec<Option<LifeCycle>>>,
    pub growth_rate: Option<GrowthRate>,
    pub mature_size_height: Option<String>,
    pub mature_size_width: Option<String>,
    pub fertility: Option<Vec<Option<Fertility>>>,
    pub pollinators: Option<String>,
    pub flower_colour: Option<String>,
    pub flower_type: Option<FlowerType>,
    pub created_at: NaiveDateTime,
    pub updated_at: NaiveDateTime,
    pub has_drought_tolerance: Option<bool>,
    pub tolerates_wind: Option<bool>,
    pub plant_references: Option<Vec<Option<String>>>,
    pub is_tree: Option<bool>,
    pub nutrition_demand: Option<NutritionDemand>,
    pub preferable_permaculture_zone: Option<i16>,
    pub article_last_modified_at: Option<NaiveDateTime>,
}
/// The `Seed` entity.
#[allow(clippy::missing_docs_in_private_items)] // TODO: See #97.
#[derive(Identifiable, Queryable)]
#[diesel(table_name = seeds)]
pub struct Seed {
    pub id: i32,
    pub name: String,
    pub harvest_year: i16,
    pub use_by: Option<NaiveDate>,
    pub origin: Option<String>,
    pub taste: Option<String>,
    pub yield_: Option<String>,
    pub quantity: Quantity,
    pub quality: Option<Quality>,
    pub price: Option<i16>,
    pub generation: Option<i16>,
    pub notes: Option<String>,
    pub variety: Option<String>,
    pub plant_id: Option<i32>,
}

/// The `NewSeed` entity.
#[allow(clippy::missing_docs_in_private_items)] // TODO: See #97.
#[derive(Insertable)]
#[diesel(table_name = seeds)]
pub struct NewSeed {
    pub name: String,
    pub plant_id: Option<i32>,
    pub harvest_year: i16,
    pub use_by: Option<NaiveDate>,
    pub origin: Option<String>,
    pub taste: Option<String>,
    pub yield_: Option<String>,
    pub quantity: Quantity,
    pub quality: Option<Quality>,
    pub price: Option<i16>,
    pub generation: Option<i16>,
    pub notes: Option<String>,
    pub variety: Option<String>,
}

/// Information for displaying the base layer
#[derive(Identifiable, Queryable)]
#[diesel(table_name = base_layers)]
pub struct BaseLayer {
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
#[derive(Insertable)]
#[diesel(table_name = base_layers)]
pub struct NewBaseLayer {
    /// Indicates where the image is stored in Nextcloud.
    pub base_image_url: String,
    /// Conversion factor from image pixels to real world distances.
    pub pixels_per_meter: f64,
    /// the amount of rotation required to align the base image with geographical north.
    pub north_orientation_degrees: f64,
}

