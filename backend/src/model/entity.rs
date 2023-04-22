//! Contains all entities used in `PermaplanT`.

pub mod plants_impl;
pub mod seed_impl;

use chrono::NaiveDate;
use chrono::NaiveDateTime;

use diesel::{Identifiable, Insertable, Queryable};

use crate::schema::{plants, seeds};

use super::r#enum::{
    deciduous_or_evergreen::DeciduousOrEvergreen, external_source::ExternalSource,
    fertility::Fertility, flower_type::FlowerType, growth_rate::GrowthRate,
    herbaceous_or_woody::HerbaceousOrWoody, life_cycle::LifeCycle,
    light_requirement::LightRequirement, nutrition_demand::NutritionDemand,
    propagation_method::PropagationMethod, quality::Quality, quantity::Quantity, soil_ph::SoilPh,
    soil_texture::SoilTexture, soil_water_retention::SoilWaterRetention,
    water_requirement::WaterRequirement,
};

/// The `Plants` entity.
#[allow(clippy::missing_docs_in_private_items)] // TODO: See #97.
#[derive(Identifiable, Queryable)]
#[diesel(table_name = plants)]
pub struct Plants {
    /// The internal id of the plant.
    pub id: i32,
    /// The unique name of the plant. The structure is described in the /doc/database/hierarchy.md document in the repository.
    pub unique_name: String,
    /// The list of the common names of the plant.
    pub common_name_en: Option<Vec<Option<String>>>,
    /// The list of the common names of the plant in German. Fetched from Wikidata API if not present in the source datasets.
    pub common_name_de: Option<Vec<Option<String>>>,
    /// Family of the plant.
    pub family: Option<String>,
    /// Subfamily of the plant.
    pub subfamily: Option<String>,
    /// Genus of the plant.
    pub genus: Option<String>,
    ///
    pub edible_uses_en: Option<String>,
    ///
    pub medicinal_uses: Option<String>,
    ///
    pub material_uses_and_functions: Option<String>,
    ///
    pub botanic: Option<String>,
    ///
    pub material_uses: Option<String>,
    ///
    pub functions: Option<String>,
    ///
    pub heat_zone: Option<i16>,
    ///
    pub shade: Option<String>,
    /// The list of enum values.
    pub soil_ph: Option<Vec<Option<SoilPh>>>,
    /// The list of enum values.
    pub soil_texture: Option<Vec<Option<SoilTexture>>>,
    /// The list of enum values.
    pub soil_water_retention: Option<Vec<Option<SoilWaterRetention>>>,
    ///
    pub environmental_tolerances: Option<Vec<Option<String>>>,
    ///
    pub native_geographical_range: Option<String>,
    ///
    pub native_environment: Option<String>,
    ///
    pub ecosystem_niche: Option<String>,
    /// Enum value.
    pub deciduous_or_evergreen: Option<DeciduousOrEvergreen>,
    /// Enum value.
    pub herbaceous_or_woody: Option<HerbaceousOrWoody>,
    /// The list of enum values.
    pub life_cycle: Option<Vec<Option<LifeCycle>>>,
    /// The list of enum values.
    pub growth_rate: Option<Vec<Option<GrowthRate>>>,
    ///
    pub height: Option<String>,
    ///
    pub width: Option<String>,
    /// The list of enum values.
    pub fertility: Option<Vec<Option<Fertility>>>,
    ///
    pub pollinators: Option<String>,
    ///
    pub flower_colour: Option<String>,
    /// Enum value.
    pub flower_type: Option<FlowerType>,
    /// The creation date of the entry.
    pub created_at: NaiveDateTime,
    /// The last update date of the entry.
    pub updated_at: NaiveDateTime,
    ///
    pub has_drought_tolerance: Option<bool>,
    ///
    pub tolerates_wind: Option<bool>,
    /// The list of the references of the plant.
    pub plant_references: Option<Vec<Option<String>>>,
    /// Boolean value indicating whether the plant is a tree. The initial value is to `True` if  herbaceous_or_woody (woody) and life_cycle (perennial)
    pub is_tree: Option<bool>,
    /// Enum value. The initial value is to `light feeder` if "Nutritionally poor soil" in `environmental_tolerances` is present.
    pub nutrition_demand: Option<NutritionDemand>,
    /// Number value between -1..6 (-1 should be printed as 00)
    pub preferable_permaculture_zone: Option<i16>,
    /// Date value fetched from PracticalPlants page showing the last modification date of the plant.
    pub article_last_modified_at: Option<NaiveDateTime>,
    ///
    pub hardiness_zone: Option<String>,
    /// The list of enum values.
    pub light_requirement: Option<Vec<Option<LightRequirement>>>,
    /// The list of enum values.
    pub water_requirement: Option<Vec<Option<WaterRequirement>>>,
    /// The list of enum values.
    pub propagation_method: Option<Vec<Option<PropagationMethod>>>,
    ///
    pub alternate_name: Option<String>,
    ///
    pub diseases: Option<String>,
    ///
    pub edible: Option<bool>,
    ///
    pub edible_parts: Option<Vec<Option<String>>>,
    ///
    pub germination_temperature: Option<String>,
    ///
    pub introduced_into: Option<String>,
    ///
    pub layer: Option<String>,
    ///
    pub leaves: Option<String>,
    ///
    pub medicinal_parts: Option<String>,
    ///
    pub native_to: Option<String>,
    ///
    pub plants_for_a_future: Option<String>,
    ///
    pub plants_of_the_world_online_link: Option<String>,
    ///
    pub plants_of_the_world_online_link_synonym: Option<String>,
    ///
    pub pollination: Option<String>,
    ///
    pub propagation_transplanting: Option<String>,
    ///
    pub resistance: Option<String>,
    ///
    pub root_type: Option<String>,
    ///
    pub seed_planting_depth_en: Option<String>,
    ///
    pub seed_viability: Option<String>,
    ///
    pub slug: Option<String>,
    ///
    pub spread: Option<String>,
    ///
    pub utility: Option<String>,
    ///
    pub warning: Option<String>,
    ///
    pub when_to_plant_cuttings: Option<String>,
    ///
    pub when_to_plant_division: Option<String>,
    ///
    pub when_to_plant_transplant: Option<String>,
    ///
    pub when_to_sow_indoors: Option<String>,
    ///
    pub sowing_outdoors_en: Option<String>,
    ///
    pub when_to_start_indoors_weeks: Option<String>,
    ///
    pub when_to_start_outdoors_weeks: Option<String>,
    ///
    pub cold_stratification_temperature: Option<String>,
    ///
    pub cold_stratification_time: Option<String>,
    ///
    pub days_to_harvest: Option<String>,
    ///
    pub habitat: Option<String>,
    ///
    pub spacing_en: Option<String>,
    ///
    pub wikipedia: Option<String>,
    ///
    pub days_to_maturity: Option<String>,
    ///
    pub pests: Option<String>,
    ///
    pub version: Option<String>,
    ///
    pub germination_time: Option<String>,
    ///
    pub description: Option<String>,
    /// The permapeople id of the parent entry pointing to the `external_id` column.
    pub parent_id: Option<String>,
    /// Enum value indicating the source of the entry.
    pub external_source: Option<ExternalSource>,
    /// The external id of the entry used in combination with the `external_source` column.
    pub external_id: Option<String>,
    /// The external url provided by the origin source.
    pub external_url: Option<String>,
    ///
    pub root_depth: Option<String>,
    ///
    pub external_article_number: Option<String>,
    ///
    pub external_portion_content: Option<String>,
    ///
    pub sowing_outdoors_de: Option<String>,
    /// String array of numbers representing a time period. The year is divided into 24 periods of half a month each. For example "\[8,9,10\]" means from the 2nd half of April to the 2nd half of May incl.
    pub sowing_outdoors: Option<String>,
    /// String array of numbers representing a time period. The year is divided into 24 periods of half a month each. For example "\[8,9,10\]" means from the 2nd half of April to the 2nd half of May incl.
    pub harvest_time: Option<String>,
    ///
    pub spacing_de: Option<String>,
    ///
    pub required_quantity_of_seeds_de: Option<String>,
    ///
    pub required_quantity_of_seeds_en: Option<String>,
    ///
    pub seed_planting_depth_de: Option<String>,
    ///
    pub seed_weight_1000_de: Option<String>,
    ///
    pub seed_weight_1000_en: Option<String>,
    ///
    pub seed_weight_1000: Option<String>,
    ///
    pub machine_cultivation_possible: Option<String>,
    ///
    pub edible_uses_de: Option<String>,
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
