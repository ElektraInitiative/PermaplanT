//! Contains all entities used in `PermaplanT`.

pub mod plants_impl;
pub mod seed_impl;

use chrono::NaiveDate;
use diesel::{Identifiable, Insertable, Queryable};

use crate::schema::{plant_detail, plants, seeds};

use super::r#enum::{quality::Quality, quantity::Quantity};

use super::r#enum::{
    deciduous_or_evergreen::DeciduousOrEvergreen, fertility::Fertility, flower_type::FlowerType,
    growth_rate::GrowthRate, herbaceous_or_woody::HerbaceousOrWoody, life_cycle::LifeCycle,
    nutrition_demand::NutritionDemand, root_zone_tendancy::RootZoneTendancy, shade::Shade,
    soil_ph::SoilPh, soil_texture::SoilTexture, soil_water_retention::SoilWaterRetention, sun::Sun,
    water::Water,
};

/// The `Plants` entity.
#[allow(clippy::missing_docs_in_private_items)] // TODO: See #97.
#[derive(Identifiable, Queryable)]
#[diesel(table_name = plants)]
pub struct Plants {
    pub id: i32,
    pub tags: Vec<Option<String>>,
    pub species: String,
    pub plant: Option<String>,
    pub plant_type: Option<i32>,
}

/// The `Seed` entity.
#[allow(clippy::missing_docs_in_private_items)] // TODO: See #97.
#[derive(Identifiable, Queryable)]
#[diesel(table_name = seeds)]
pub struct Seed {
    pub id: i32,
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

/// The `PlantDetail` entity.
#[derive(Identifiable, Queryable)]
#[diesel(table_name = plant_detail)]
pub struct PlantDetail {
    /// The plant id.
    pub id: i32,
    /// The plant's binomial name.
    pub binomial_name: String,
    /// The plant's common name.
    pub common_name: Vec<Option<String>>,
    /// The plant's common name in German. Fetched from Wikipedia.
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
    /// The plant is a tree. The initial rule is `herbaceous_or_woody`=`woody` AND `life_cycle`=`perennial'
    pub is_tree: bool,
    /// The initial rule is `light feeder` if `Nutritionally poor soil` in `environmental_tolerances`
    pub nutrition_demand: Option<NutritionDemand>,
    pub preferable_permaculture_zone: Option<i16>,
}
