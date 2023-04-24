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
    propagation_method::PropagationMethod, quality::Quality, quantity::Quantity, shade::Shade,
    soil_ph::SoilPh, soil_texture::SoilTexture, soil_water_retention::SoilWaterRetention,
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
    /// Genus of the plant.
    pub genus: Option<String>,
    /// Fetched from Permapeople as \`edible_uses\` and merged with Reinsaat.  (fetched from Permapeople and Reinsaat)
    pub edible_uses_en: Option<String>,
    /// Fetched from PracticalPlants as \`medicinal_uses\` and merged with Permapeople. (fetched from PracticalPlants and Permapeople)
    pub medicinal_uses: Option<String>,
    /// (fetched from PracticalPlants)
    pub material_uses_and_functions: Option<String>,
    /// (fetched from PracticalPlants)
    pub botanic: Option<String>,
    /// (fetched from PracticalPlants)
    pub material_uses: Option<String>,
    /// (fetched from PracticalPlants)
    pub functions: Option<String>,
    /// (fetched from PracticalPlants)
    pub heat_zone: Option<i16>,
    /// (fetched from PracticalPlants)
    pub shade: Option<Shade>,
    /// Merged between Permapeople and PracticalPlants. (fetched from PracticalPlants and Permapeople)
    pub soil_ph: Option<Vec<Option<SoilPh>>>,
    /// Merged with soil_type of Permapeople. (fetched from PracticalPlants and Permapeople)
    pub soil_texture: Option<Vec<Option<SoilTexture>>>,
    /// (fetched from PracticalPlants)
    pub soil_water_retention: Option<Vec<Option<SoilWaterRetention>>>,
    /// (fetched from PracticalPlants)
    pub environmental_tolerances: Option<Vec<Option<String>>>,
    /// (fetched from PracticalPlants)
    pub native_geographical_range: Option<String>,
    /// (fetched from PracticalPlants)
    pub native_environment: Option<String>,
    /// (fetched from PracticalPlants)
    pub ecosystem_niche: Option<String>,
    /// Fetched from PracticalPlants and merged with \`leaves\` of Permapeople. (fetched from PracticalPlants and Permapeople)
    pub deciduous_or_evergreen: Option<DeciduousOrEvergreen>,
    /// (fetched from PracticalPlants)
    pub herbaceous_or_woody: Option<HerbaceousOrWoody>,
    /// Merged with life_cycle of Permapeople. (fetched from PracticalPlants and Permapeople)
    pub life_cycle: Option<Vec<Option<LifeCycle>>>,
    /// Merged with growth of Permapeople. (fetched from PracticalPlants and Permapeople)
    pub growth_rate: Option<Vec<Option<GrowthRate>>>,
    /// Fetched from PracticalPlants as \`mature_size_height\` and merged with Permapeople. (fetched from PracticalPlants and Permapeople)
    pub height: Option<String>,
    /// Fetched from PracticalPlants as \`mature_size_width\` and merged with Permapeople. (fetched from PracticalPlants and Permapeople)
    pub width: Option<String>,
    /// (fetched from PracticalPlants)
    pub fertility: Option<Vec<Option<Fertility>>>,
    /// (fetched from PracticalPlants)
    pub flower_colour: Option<String>,
    /// (fetched from PracticalPlants)
    pub flower_type: Option<FlowerType>,
    /// The creation date of the entry.
    pub created_at: NaiveDateTime,
    /// The last update date of the entry.
    pub updated_at: NaiveDateTime,
    /// Fetched from PracticalPlants and merged with \`has_drought_tolerance\` of Permapeople. (fetched from PracticalPlants and Permapeople)
    pub has_drought_tolerance: Option<bool>,
    /// (fetched from PracticalPlants)
    pub tolerates_wind: Option<bool>,
    /// The list of the references of the plant.
    pub plant_references: Option<Vec<Option<String>>>,
    /// Boolean value indicating whether the plant is a tree. The initial value is to `True` if  herbaceous_or_woody (woody) and life_cycle (perennial)
    pub is_tree: Option<bool>,
    ///  The initial value is to `light feeder` if "Nutritionally poor soil" in `environmental_tolerances` is present.
    pub nutrition_demand: Option<NutritionDemand>,
    /// Number value between -1..6 (-1 should be printed as 00)
    pub preferable_permaculture_zone: Option<i16>,
    /// Date value fetched from PracticalPlants page showing the last modification date of the plant.
    pub article_last_modified_at: Option<NaiveDateTime>,
    /// Merged with usda_hardiness_zone of Permapeople. (fetched from PracticalPlants and Permapeople)
    pub hardiness_zone: Option<String>,
    /// Merged with sun of PracticalPlants. (fetched from PracticalPlants and Permapeople)
    pub light_requirement: Option<Vec<Option<LightRequirement>>>,
    /// Merged with water of PracticalPlants. (fetched from PracticalPlants and Permapeople)
    pub water_requirement: Option<Vec<Option<WaterRequirement>>>,
    /// (fetched from Permapeople)
    pub propagation_method: Option<Vec<Option<PropagationMethod>>>,
    /// (fetched from Permapeople)
    pub alternate_name: Option<String>,
    /// (fetched from Permapeople)
    pub diseases: Option<String>,
    /// (fetched from Permapeople)
    pub edible: Option<bool>,
    /// (fetched from Permapeople)
    pub edible_parts: Option<Vec<Option<String>>>,
    /// (fetched from Permapeople)
    pub germination_temperature: Option<String>,
    /// (fetched from Permapeople)
    pub introduced_into: Option<String>,
    /// Fetched from Permapeople as \`layer\` and renamed. (fetched from Permapeople)
    pub habitus: Option<String>,
    /// (fetched from Permapeople)
    pub medicinal_parts: Option<String>,
    /// (fetched from Permapeople)
    pub native_to: Option<String>,
    /// (fetched from Permapeople)
    pub plants_for_a_future: Option<String>,
    /// (fetched from Permapeople)
    pub plants_of_the_world_online_link: Option<String>,
    /// (fetched from Permapeople)
    pub plants_of_the_world_online_link_synonym: Option<String>,
    /// Fetched from PracticalPlants as \`pollinators\` and merged with \`pollination\` of Permapeople. (fetched from PracticalPlants and Permapeople)
    pub pollination: Option<String>,
    /// (fetched from Permapeople)
    pub propagation_transplanting: Option<String>,
    /// (fetched from Permapeople)
    pub resistance: Option<String>,
    /// (fetched from Permapeople)
    pub root_type: Option<String>,
    /// Fetched from Permapeople as \`seed_planting_depth\` and renamed. (fetched from Permapeople)
    pub seed_planting_depth_en: Option<String>,
    /// (fetched from Permapeople)
    pub seed_viability: Option<String>,
    /// The final part of the URL of the plant on the Permapeople website. This field can be potentially used to construct the external_url field traversing through all the parents given by parent_id.  (Fetched from Permapeople)
    pub slug: Option<String>,
    /// (fetched from Permapeople)
    pub spread: Option<String>,
    /// (fetched from Permapeople)
    pub utility: Option<String>,
    /// (fetched from Permapeople)
    pub warning: Option<String>,
    /// (fetched from Permapeople)
    pub when_to_plant_cuttings: Option<String>,
    /// (fetched from Permapeople)
    pub when_to_plant_division: Option<String>,
    /// (fetched from Permapeople)
    pub when_to_plant_transplant: Option<String>,
    /// (fetched from Permapeople)
    pub when_to_sow_indoors: Option<String>,
    /// Fetched from Permapeople as \`when_to_sow_outdoors\` and renamed. (fetched from Permapeople)
    pub sowing_outdoors_en: Option<String>,
    /// (fetched from Permapeople)
    pub when_to_start_indoors_weeks: Option<String>,
    /// (fetched from Permapeople)
    pub when_to_start_outdoors_weeks: Option<String>,
    /// (fetched from Permapeople)
    pub cold_stratification_temperature: Option<String>,
    /// (fetched from Permapeople)
    pub cold_stratification_time: Option<String>,
    /// (fetched from Permapeople)
    pub days_to_harvest: Option<String>,
    /// (fetched from Permapeople)
    pub habitat: Option<String>,
    /// Fetched from Permapeople as \`spacing\` and from Reinsaat as Distances and renamed. (fetched from Permapeople and Reinsaat)
    pub spacing_en: Option<String>,
    /// Fetched from Permapeople as \`wikipedia\` and renamed. (fetched from Permapeople)
    pub wikipedia_url: Option<String>,
    /// (fetched from Permapeople)
    pub days_to_maturity: Option<String>,
    /// (fetched from Permapeople)
    pub pests: Option<String>,
    /// The version of the entry. (fetched from Permapeople)
    pub version: Option<String>,
    /// (fetched from Permapeople)
    pub germination_time: Option<String>,
    /// The description of the entry. (fetched from Permapeople)
    pub description: Option<String>,
    /// The permapeople id of the parent entry pointing to the `external_id` column. (fetched from Permapeople)
    pub parent_id: Option<String>,
    /// Enum value indicating the source of the entry.
    pub external_source: Option<ExternalSource>,
    /// The external id of the entry used in combination with the `external_source` column.
    pub external_id: Option<String>,
    /// The external URL provided by the origin source.
    pub external_url: Option<String>,
    /// Fetched from PracticalPlants as \`root_zone_tendency\` and merged with root_depth of Permapeople. (fetched from PracticalPlants and Permapeople)
    pub root_depth: Option<String>,
    /// The article number of the plant in the Reinsaat database. (fetched from Reinsaat)
    pub external_article_number: Option<String>,
    /// (fetched from Reinsaat)
    pub external_portion_content: Option<String>,
    /// Fetched from Reinsaat as \`Direktsaat\` and renamed. (fetched from Reinsaat)
    pub sowing_outdoors_de: Option<String>,
    /// String array of numbers representing a time period. The year is divided into 24 periods of half a month each. For example "\[8,9,10\]" means from the 2nd half of April to the 2nd half of May incl. (fetched from Reinsaat)
    pub sowing_outdoors: Option<Vec<Option<i16>>>,
    /// String array of numbers representing a time period. The year is divided into 24 periods of half a month each. For example "\[8,9,10\]" means from the 2nd half of April to the 2nd half of May incl. (fetched from Reinsaat)
    pub harvest_time: Option<Vec<Option<i16>>>,
    /// (fetched from Reinsaat)
    pub spacing_de: Option<String>,
    /// (fetched from Reinsaat)
    pub required_quantity_of_seeds_de: Option<String>,
    /// (fetched from Reinsaat)
    pub required_quantity_of_seeds_en: Option<String>,
    /// (fetched from Reinsaat)
    pub seed_planting_depth_de: Option<String>,
    /// (fetched from Reinsaat)
    pub seed_weight_1000_de: Option<String>,
    /// (fetched from Reinsaat)
    pub seed_weight_1000_en: Option<String>,
    /// Fetched from Permapeople as \`1000_seed_weight_g\` and renamed. (fetched from Permapeople)
    pub seed_weight_1000: Option<f64>,
    /// (fetched from Reinsaat)
    pub machine_cultivation_possible: Option<String>,
    /// (fetched from Reinsaat)
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
