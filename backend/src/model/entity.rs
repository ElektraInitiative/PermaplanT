//! Contains all entities used in `PermaplanT`.

pub mod base_layer_images_impl;
pub mod blossoms_impl;
pub mod drawings;
pub mod drawings_impl;
pub mod guided_tours_impl;
pub mod layer_impl;
pub mod map_impl;
pub mod plant_layer;
pub mod plantings;
pub mod plantings_impl;
pub mod plants_impl;
pub mod seed_impl;
pub mod timeline;
pub mod users_impl;

use chrono::NaiveDate;
use chrono::NaiveDateTime;

use diesel::AsChangeset;
use diesel::QueryableByName;
use diesel::{Identifiable, Insertable, Queryable};
use postgis_diesel::types::Point;
use postgis_diesel::types::Polygon;
use uuid::Uuid;

use crate::schema::{
    base_layer_images, blossoms, gained_blossoms, guided_tours, layers, maps, plants, seeds, users,
};

use super::r#enum::experience::Experience;
use super::r#enum::membership::Membership;
use super::r#enum::privacy_option::PrivacyOption;
use super::r#enum::salutation::Salutation;
use super::r#enum::track::Track;
use super::r#enum::{
    deciduous_or_evergreen::DeciduousOrEvergreen, external_source::ExternalSource,
    fertility::Fertility, /*flower_type::FlowerType, */ growth_rate::GrowthRate,
    herbaceous_or_woody::HerbaceousOrWoody, layer_type::LayerType, life_cycle::LifeCycle,
    light_requirement::LightRequirement, /*nutrition_demand::NutritionDemand,*/
    propagation_method::PropagationMethod, quality::Quality, quantity::Quantity, shade::Shade,
    soil_ph::SoilPh, soil_texture::SoilTexture,
    /*soil_water_retention::SoilWaterRetention, */ water_requirement::WaterRequirement,
};

/// The `Plants` entity builds up an hierarchical structure, see `/doc/database/hierarchy.md`:
///
#[doc = include_str!("../../../doc/database/hierarchy.md")]
///
#[derive(Debug, Identifiable, Queryable, QueryableByName)]
#[diesel(table_name = plants)]
pub struct Plants {
    /// - The internal id of the plant.
    /// - *Fill ratio:* 100%
    pub id: i32,

    /// - The unique name of the plant.
    /// - The structure is described above (`doc/database/hierarchy.md`).
    /// - *Fill ratio:* 100%
    pub unique_name: String,

    /// - The list of the common names of the plant in English.
    /// - *Fetched from* PracticalPlants and Permapeople.
    /// - *Fill ratio:* 90%
    pub common_name_en: Option<Vec<Option<String>>>,

    /// - The list of the common names of the plant in German.
    /// - *Fetched from* Wikidata API if not present in any source datasets.
    /// - *Fill ratio:* 25%
    pub common_name_de: Option<Vec<Option<String>>>,

    /// - Family of the plant.
    /// - See `/doc/architecture/glossary.md`.
    /// - *Used* to build up hierarchy.
    /// - *Fetched from* PracticalPlants and Permapeople.
    /// - *Fill ratio:* 88%
    pub family: Option<String>,

    /*
    /// - Genus of the plant.
    /// - Is also first word of unique_name, see above (`/doc/database/hierarchy.md`)
    /// - *See also* `/doc/architecture/glossary.md`.
    /// - *Used* to build up hierarchy.
    /// - Genus is determined by botanical nomenclature. Sometimes gets changed due to modern insights through genetical research.
    /// - *Fetched from* PracticalPlants and Permapeople.
    /// - *TODO:* copy from first word of unique name.
    /// - *Fill ratio:* 63%
    pub genus: Option<String>,
    */
    /// - The edible use of the plant, answering: Which food type can be produced from this plant, e.g. oil?
    /// - Interesting for search functionality.
    /// - *Fetched from* Permapeople as `edible_uses` and merged with Reinsaat.
    /// - *Fill ratio:* 6%
    pub edible_uses_en: Option<String>,

    /*
    /// - Not used.
    /// - *Fetched from* PracticalPlants as `medicinal_uses` and merged with Permapeople.
    /// - *Fill ratio:* 1%
    //pub medicinal_uses: Option<String>,

    /// - Only for references.
    /// - *Fetched from* PracticalPlants)
    /// - *Fill ratio:* 34%
    pub material_uses_and_functions: Option<String>,

    /// - Only for references.
    /// - *Fetched from* PracticalPlants)
    /// - *Fill ratio:* 63%
    pub botanic: Option<String>,
    */

    /*
    /// - Only informational.
    /// - *Fetched from* PracticalPlants
    /// - Plants are not only used for food but also for other uses, e.g. fiber to produce paper.
    /// - *Fill ratio:* 1%
    //pub material_uses: Option<String>,
     */
    /// - *Used* for search ranking (diversity).
    /// - ecological and environmental function of the plant, especially nitrogen fixer is relevant for PermaplanT.
    /// - *Fetched from* PracticalPlants)
    /// - *Fill ratio:* 13%
    pub functions: Option<String>,

    /// - Not used.
    /// - *Use* hardiness_zone instead.
    /// - indication of the heat range a plant endures.
    /// - *Fetched from* PracticalPlants
    /// - *Fill ratio:* 0.05%
    pub heat_zone: Option<i16>,

    /// - Shade tolerance of the plant, to be used together with light_requirement.
    /// - *Used* in shade layer.
    /// - *For example* a plant that has "no shade", should get a warning if placed in a shade.
    /// - No shade: full sun exposure
    /// - Light shade: moderately shaded throughout the day
    /// - Partial shade: about 3-6 hours of direct sunlight
    /// - Permanent shade: less than 3 hours of direct sunlight
    /// - Permanent deep shade: almost no sunlight/no direct sunlight
    /// - Shade indicates the shade tolerance. Plants obviously grow better with better light conditions.
    /// - Warnings should only show if a plant is moved into a too dark spot.
    ///   No warning should be shown when moved into a lighter spot.
    /// - *Fetched from* PracticalPlants.
    /// - *Fill ratio:* 63%
    pub shade: Option<Shade>,

    /// - *See* explanation in `/doc/architecture/context.md`
    /// - Soil PH can be tested by the user with simple means (e.g. litmus).
    /// - *Used* in soil layer.
    /// - *Fetched from* PracticalPlants and Permapeople (merged between Permapeople and PracticalPlants).
    /// - *Fill ratio:* 1%
    pub soil_ph: Option<Vec<Option<SoilPh>>>,

    /// - *See* explanation in `/doc/architecture/context.md`
    /// - *Used* in soil layer.
    /// - *Fetched from* PracticalPlants and Permapeople (merged with `soil_type` of Permapeople).
    /// - *Fill ratio:* 88%
    pub soil_texture: Option<Vec<Option<SoilTexture>>>,

    /*
    /// - *Used* in hydrology layer.
    /// - *Fetched from* PracticalPlants
    /// - wet = drowned, (often) flooded or in general very moist, e.g. swamp
    /// - moist = humid, can hold some water, e.g. flat bed with humus
    /// - well drained = dry, low capacity to hold water, e.g. sandhill.
    /// - *Fill ratio:* 37%
    pub soil_water_retention: Option<Vec<Option<SoilWaterRetention>>>,
    */
    /*
    /// - Only informational.
    /// - *Fetched from* PracticalPlants
    /// - gives information about environmental conditions, such as drought or wind tolerance
    /// - *Fill ratio:* 15%
    //pub environmental_tolerances: Option<Vec<Option<String>>>,

    /// - Not used.
    /// - *Fetched from* PracticalPlants
    /// - *Fill ratio:* 0.2%
    //pub native_geographical_range: Option<String>,

    /// - Not used.
    /// - *Fetched from* PracticalPlants
    /// - *Fill ratio:* 0.1%
    //pub native_environment: Option<String>,
    */
    /// - Interesting for search functionality.
    /// - *Fetched from* PracticalPlants
    /// - informs about the (vertical) layer, that the plant usually inhabits, e.g. soil surface or canopy
    /// - *Fill ratio:* 16%
    pub ecosystem_niche: Option<String>,

    /// - Only informational.
    /// - deciduous = plants loose leaves in winter.
    /// - evergreen = Plants don't throw leaves (e.g. pine tree).
    /// - Not applicable for annual plants.
    /// - *Fetched from* PracticalPlants and merged with `leaves` of Permapeople.
    /// - *Fill ratio:* 30%
    pub deciduous_or_evergreen: Option<DeciduousOrEvergreen>,

    /// - Only informational.
    /// - Fetched from PracticalPlants
    /// - informs about the plant physiology
    /// - woody = grows woody parts
    /// - herbaceous = doesn't grow wood, shoots remain soft/green.
    /// - *Fill ratio:* 26%
    pub herbaceous_or_woody: Option<HerbaceousOrWoody>,

    /// - Determines life span of the plant.
    /// - *Fetched from* PracticalPlants and Permapeople (merged with `life_cycle` of Permapeople).
    /// - *Fill ratio:* 68%
    pub life_cycle: Option<Vec<Option<LifeCycle>>>,

    /// - Only informational.
    /// - *Fetched from* PracticalPlants and Permapeople (merged with `growth` of Permapeople).
    /// - *Fill ratio:* 30%
    pub growth_rate: Option<Vec<Option<GrowthRate>>>,

    /// - Only informational.
    /// - *Fetched from* PracticalPlants as `mature_size_height` and merged with Permapeople.
    /// - informs about the maximum height that the plant gains in cm
    /// - *Fill ratio:* 80%
    pub height: Option<i32>,

    /*
    /// - Determines how large the plant can grow in diameter.
    /// - Other plants should get a warning if planted within this area.
    /// - *TODO:* replaced with spread, will keep this for now for information
    /// - *Fetched from* PracticalPlants as `mature_size_width` and merged with Permapeople.
    /// - *Fill ratio:* 22%
    //pub width: Option<String>,
     */
    /// - Only informational.
    /// - *Fetched from* PracticalPlants
    /// - *Fill ratio:* 18%
    pub fertility: Option<Vec<Option<Fertility>>>,

    /*
    /// - Only informational.
    /// - *Fetched from* PracticalPlants
    /// - *Fill ratio:* 0.5%
    //pub flower_colour: Option<String>,

    /// - Only informational.
    /// - *Fetched from* PracticalPlants
    /// - a plant can contain flowers of two different sexes, male or female (monoecious), a plant can contain only flowers of one specific sex and therefore needs at least another plant of the other sex to reproduce (dioecious) or can contain flowers that have both the sexes within the same flower (hermaphrodite).
    /// - *Fill ratio:* 62%
    pub flower_type: Option<FlowerType>,
    */
    /// - The creation date of the entry.
    /// - Only for administration.
    /// - *Fill ratio:* 100%
    pub created_at: NaiveDateTime,

    /// - The last update date of the entry.
    /// - Only for administration.
    /// - *Fill ratio:* 100%
    pub updated_at: NaiveDateTime,

    /// - *Used* in hydrology layer.
    /// - Fetched from PracticalPlants and merged with \`has_drought_tolerance\` of Permapeople.
    /// - *Fill ratio:* 57%
    pub has_drought_tolerance: Option<bool>,

    /// - *Used* in wind layer.
    /// - *Fetched from* PracticalPlants.
    /// - *Fill ratio:* 10%
    pub tolerates_wind: Option<bool>,

    /*
    /// - The list of the references of the plant.
    /// - `references` items link to these items.
    /// - Only informational.
    /// - *Fill ratio:* 58%
    pub plant_references: Option<Vec<Option<String>>>,
    */

    /*
    /// - Boolean value indicating whether the plant is a tree.
    /// - Plants with `is_tree == true` can be used in the tree layer.
    /// - In plants layer all plants can be used.
    /// - *Initial value* is to `True` if  herbaceous_or_woody (woody) and life_cycle (perennial)
    /// - *Fill ratio:* 0.1%
    pub is_tree: Option<bool>,

    /// - Only informational.
    /// - *Initial value* is to `light feeder` if "Nutritionally poor soil" in `environmental_tolerances` is present.
    /// - *Fill ratio:* 0.04%
    pub nutrition_demand: Option<NutritionDemand>,
    */
    /// - Not used.
    /// - Number value between -1..6 (-1 should be printed as 00)
    /// - *Fill ratio:* 0%
    pub preferable_permaculture_zone: Option<i16>,
    /*
    /// - When article was modified last time.
    /// - Only for administration.
    /// - Date value fetched from PracticalPlants page showing the last modification date of the plant.
    /// - *Fill ratio:* 63%
    pub article_last_modified_at: Option<NaiveDateTime>,
    */
    /// - USDA Hardiness Zone (without subranges).
    /// - Important information.
    /// - Fetched from PracticalPlants and Permapeople (merged with usda_hardiness_zone of Permapeople).
    /// - *Fill ratio:* 63%
    pub hardiness_zone: Option<String>,

    /// - Shade tolerance of the plant, to be used together with shade.
    /// - *Used* in shade layer.
    /// - *For example* a plant that has "Full sun", should get a warning if placed in a shade.
    /// - **Fetched from*** PracticalPlants and Permapeople (merged with `sun` of PracticalPlants)
    /// - Full sun: full sun exposure
    /// - Partial sun/shade: about 3-6 hours of direct sunlight or moderately shaded throughout the day
    /// - Full shade: less than 3 hours of direct sunlight or almost no sunlight/no direct sunlight
    /// - *Fill ratio:* 88%
    pub light_requirement: Option<Vec<Option<LightRequirement>>>,

    /// - *Used* in hydrology layer.
    /// - *Fetched from* PracticalPlants and Permapeople (merged with `water` of PracticalPlants).
    /// - water = completely aquatic; wet = drowned, (often) flooded or in general very moist, e.g. swamp; moist = humid, regular water supply, e.g. flat bed with humus; well drained = dry, little water input.
    /// - *Fill ratio:* 88%
    pub water_requirement: Option<Vec<Option<WaterRequirement>>>,

    /// - Only informational.
    /// - *Fetched from* Permapeople (renamed from `propagation`)
    /// - How to reproduce a plant: cuttings = cut pieces of wood; layering = let low branches reach the soil to root; Seed - direct sow = sow directly the seeds; division = split the rhizomes (roots) into pieces; Spores = plant reproduces via spores (e.g. ferns, funghi); seed - transplant = raise indoors from seed and transplant to outdoors later
    /// - *Fill ratio:* 0.9%
    pub propagation_method: Option<Vec<Option<PropagationMethod>>>,

    /// - Only informational.
    /// - May be used in search functionality (low priority).
    /// - *Fetched from* Permapeople.
    /// - *Fill ratio:* 35%
    pub alternate_name: Option<String>,

    /*
    /// - Only informational.
    /// - *Fetched from* Permapeople.
    /// - *Fill ratio:* 0.02%
    //pub diseases: Option<String>,
     */
    /// - Important information.
    /// - *Fetched from* Permapeople.
    /// - *Fill ratio:* 62%
    pub edible: Option<bool>,

    /// - Only informational.
    /// - *Fetched from* Permapeople.
    /// - which organ of the plant can be eaten, e.g. root, leaves.
    /// - *Fill ratio:* 61%
    pub edible_parts: Option<Vec<Option<String>>>,

    /*
    /// - Only informational.
    /// - *Fetched from* Permapeople.
    /// - Reinsaat: `Keimtemperatur` should be copied to `germination_temperature`
    /// - Germination means that all conditions are right for a seed to start growing. Temperature is one essential factor.
    /// - *Fill ratio:* 2%
    //pub germination_temperature: Option<String>,

    /// - Not used.
    /// - *Fetched from* Permapeople.
    /// - *Fill ratio:* 36%
    //pub introduced_into: Option<String>,

    /// - Only informational.
    /// - *Fetched from* Permapeople as \`layer\` and renamed.
    /// - Habitus describes the shape of a plant.
    /// - *Fill ratio:* 48%
    //pub habitus: Option<String>,

    /// - Not used.
    /// - *Fetched from* Permapeople.
    /// - *Fill ratio:* 0.1%
    //pub medicinal_parts: Option<String>,

    /// - Only informational.
    /// - *Fetched from* Permapeople.
    /// - *Fill ratio:* 80%
    //pub native_to: Option<String>,

    /// - Not used.
    /// - *Fetched from* Permapeople.
    /// - *Fill ratio:* 86%
    //pub plants_for_a_future: Option<String>,

    /// - Not used.
    /// - *Fetched from* Permapeople.
    /// - *Fill ratio:* 86%
    //pub plants_of_the_world_online_link: Option<String>,

    /// - Not used.
    /// - *Fetched from* Permapeople.
    /// - *Fill ratio:* 15%
    //pub plants_of_the_world_online_link_synonym: Option<String>,

    /// - Only informational.
    /// - *Fetched from* PracticalPlants as `pollinators` and merged with `pollination` of Permapeople.
    /// - Pollination is the process that the pollen (male part) gets united with the pistil (female part), e.g. via bees, wind.
    /// - *Fill ratio:* 48%
    //pub pollination: Option<String>,

    /// - Only informational.
    /// - *Fetched from* Permapeople.
    /// - *Fill ratio:* 0.1%
    //pub propagation_transplanting_en: Option<String>,

    /// - Not used.
    /// - Nearly empty.
    /// - *Fetched from* Permapeople.
    /// - *Fill ratio:* 0.01%
    //pub resistance: Option<String>,

    /// - Only informational.
    /// - *Fetched from* Permapeople.
    /// - Root type describes the shape of the roots.
    /// - *Fill ratio:* 0.24%
    //pub root_type: Option<String>,

    /// - Only informational.
    /// - *Fetched from* Permapeople as `seed_planting_depth` and renamed.
    /// - Reinsaat: `Sowing depth` should be copied to `seed_planting_depth_en`
    /// - When sowing each plant has a specific value how deep the seeds should be covered with soil.
    /// - *Fill ratio:* 0.07%
    //pub seed_planting_depth_en: Option<String>,

    /// - Only informational.
    /// - *Fetched from* Permapeople.
    /// - expected average life span (in years) of a seed of a certain specie.
    /// - *Fill ratio:* 0.6%
    //pub seed_viability: Option<String>,

    /// - Not used.
    /// - The final part of the URL of the plant on the Permapeople website.
    /// - This field can be potentially used to construct the `external_url` field traversing through all the parents given by `parent_id`.
    /// - *Fetched from* Permapeople.
    /// - *Fill ratio:* 90%
    //pub slug: Option<String>,
    */
    /// - To be used.
    /// - How far a plant spreads (The 'width' of a plant) in cm
    /// - *Fetched from* Permapeople.
    /// - *Fill ratio:* 0.1%
    pub spread: Option<i32>,

    /*
    /// - Not used.
    /// - *TODO:* ovlerap with `functions`.
    /// - *Fetched from* Permapeople.
    /// - *Fill ratio:* 2%
    //pub utility: Option<String>,
     */
    /// - Important information.
    /// - *Fetched from* Permapeople.
    /// - specific warnings for eather human, animal or environmental well-being, e.g. toxic, invasive.
    /// - *Fill ratio:* 8%
    pub warning: Option<String>,

    /*
    /// - Not used.
    /// - *Fetched from* Permapeople.
    /// - *Fill ratio:* 0.06%
    //pub when_to_plant_cuttings_en: Option<String>,

    /// - Not used.
    /// - *Fetched from* Permapeople.
    /// - *Fill ratio:* 0.07%
    //pub when_to_plant_division_en: Option<String>,

    /// - Not used.
    /// - *Fetched from* Permapeople.
    /// - *Fill ratio:* 0.2%
    //pub when_to_plant_transplant_en: Option<String>,

    /// - Only informational.
    /// - *Fetched from* Permapeople.
    /// - *Fill ratio:* 0.23%
    //pub when_to_sow_indoors_en: Option<String>,

    /// - Only informational.
    /// - *Fetched from* Permapeople as `when_to_sow_outdoors` and renamed.
    /// - Reinsaat: `Sowing` or `Direct Sowing` or `Sowing outdoors` or `Sowing Direct Outdoors` should be copied to `sowing_outdoors_en`
    /// - *Fill ratio:* 0.36%
    //pub sowing_outdoors_en: Option<String>,

    /// - Only informational.
    /// - *TODO:* ask how to interpret.
    /// - *Fetched from* Permapeople.
    /// - *Fill ratio:* 0.56%
    //pub when_to_start_indoors_weeks: Option<String>,

    /// - Only informational.
    /// - *TODO:* ask how to interpret.
    /// - *Fetched from* Permapeople.
    /// - *Fill ratio:* 0.12%
    //pub when_to_start_outdoors_weeks: Option<String>,

    /// - Only informational.
    /// - *Fetched from* Permapeople.
    /// - Stratification is the process that a seed must go through to get triggered for germination, e.g. by a certain threshold of minus degrees.
    /// - *Fill ratio:* 0.03%
    //pub cold_stratification_temperature: Option<String>,

    /// - Only informational.
    /// - *Fetched from* Permapeople.
    /// - Suggested change
    /// - *Fetched from* Permapeople.
    /// - Stratification is the process that a seed must go through to get triggered for germination, e.g. by a certain amount of time under cold temperatures.
    /// - *Fill ratio:* 0.05%
    //pub cold_stratification_time: Option<String>,

    /// - Only informational.
    /// - *TODO:* should be number and then be used for calender
    /// - *Fetched from* Permapeople.
    /// - Reinsaat: `1st harvest` should be copied to `days_to_harvest`
    /// - *Fill ratio:* 0.1%
    //pub days_to_harvest: Option<String>,

    /// - Not used.
    /// - *Fetched from* Permapeople.
    /// - *Fill ratio:* 0.2%
    //pub habitat: Option<String>,

    /// - One number means it is spacing between plants and rows. Two numbers means first is spacing between plants, second between rows.
    /// - Only informational.
    /// - *Fetched from* Permapeople as `spacing` and from Reinsaat as `Distances` and renamed.
    /// - Reinsaat: `Distances` or `Spacing` should be copied to `spacing_en`
    /// - *Fill ratio:* 0.7%
    //pub spacing_en: Option<String>,

    /// - Not used.
    /// - *Fetched from* Permapeople as `wikipedia` and renamed.
    /// - *Fill ratio:* 47%
    //pub wikipedia_url: Option<String>,

    /// - Only informational.
    /// - *Fetched from* Permapeople.
    /// - *Fill ratio:* 0.3%
    //pub days_to_maturity: Option<String>,

    /// - Not used.
    /// - Nearly empty.
    /// - *Fetched from* Permapeople.
    /// - *Fill ratio:* 0.03%
    //pub pests: Option<String>,
    */
    /// - Only for administration.
    /// - The version of the entry.
    /// - To be incremented after every relevant change.
    /// - *Fetched from* Permapeople.
    /// - *Fill ratio:* 90%
    pub version: Option<i16>,

    /*
    /// - Only informational.
    /// - *Fetched from* Permapeople.
    /// - Germination time describes the time (days, weeks, months) that a seed needs to germinate given the right conditions.
    /// - *Fill ratio:* 0.5%
    //pub germination_time: Option<String>,

    /// - Not used.
    /// - *TODO:* must be renamed to `description_en` and translation needed.
    /// - The description of the entry.
    /// - *Fetched from* Permapeople.
    /// - *Fill ratio:* 5%
    //pub description: Option<String>,

    /// - Not used.
    /// - *Fetched from* permapeople id of the parent entry pointing to the `external_id` column.
    /// - *Fill ratio:* 2%
    //pub parent_id: Option<String>,
    */
    /// - Not used.
    /// - Enum value indicating the source of the entry.
    /// - *Fill ratio:* 100%
    pub external_source: Option<ExternalSource>,

    /*
    /// - Not used.
    /// - The external id of the entry used in combination with the `external_source` column.
    /// - *Fill ratio:* 90%
    //pub external_id: Option<String>,

    /// - Not used.
    /// - The external URL provided by the origin source.
    /// - *Fill ratio:* 9%
    //pub external_url: Option<String>,

    /// - Only informational.
    /// - *Fetched from* PracticalPlants as `root_zone_tendency` and merged with root_depth of Permapeople.
    /// - Root depth can be considered when planning polycultures, e.g. combining shallow roots with deep roots.
    /// - *Fill ratio:* 0.2%
    //pub root_depth: Option<String>,

    /// - Not used.
    /// - The article number `Artikelnummer` of the plant in the Reinsaat database.
    /// - *Fill ratio:* 7%
    //pub external_article_number: Option<String>,

    /// - Not used.
    /// - `Portionsinhalt` should be called `external_portion_content`
    /// - *Fetched from* Reinsaat.
    /// - *Fill ratio:* 7%
    //pub external_portion_content: Option<String>,

    /// - Only informational.
    /// - *Fetched from* Reinsaat as \`Direktsaat\` and renamed.
    /// - `Direktsaat` or `Aussaat` should be called `sowing_outdoors_de`
    /// - *Fill ratio:* 3%
    //pub sowing_outdoors_de: Option<String>,
    */
    /// - String array of numbers representing a time period.
    /// - The year is divided into 24 periods of half a month each.
    /// - *For example* "\[8,9,10\]" means from the 2nd half of April to the 2nd half of May incl.
    /// - *Fetched from* Reinsaat
    /// - `Aussaat/ Pflanzung Freiland` should be called `sowing_outdoors`
    /// - *Fill ratio:* 5%
    pub sowing_outdoors: Option<Vec<Option<i16>>>,

    /// - String array of numbers representing a time period.
    /// - The year is divided into 24 periods of half a month each.
    /// - *For example* "\[8,9,10\]" means from the 2nd half of April to the 2nd half of May incl.
    /// - `Ernte` should be called `harvest_time`
    /// - *Fetched from* Reinsaat
    /// - *Fill ratio:* 6%
    pub harvest_time: Option<Vec<Option<i16>>>,

    /*
    /// - Only informational.
    /// - *Fetched from* Reinsaat.
    /// - `Abstände` should be called `spacing_de`
    /// - *Fill ratio:* 4%
    //pub spacing_de: Option<String>,

    /// - Only informational.
    /// - *Fetched from* Reinsaat.
    /// - *Fill ratio:* 4%
    /// - `Saatgutbedarf` should be called `required_quantity_of_seeds_de`
    //pub required_quantity_of_seeds_de: Option<String>,

    /// - Only informational.
    /// - *Fetched from* Reinsaat.
    /// - `Required quantity of seeds` should be called `required_quantity_of_seeds_en`
    /// - *Fill ratio:* 3%
    //pub required_quantity_of_seeds_en: Option<String>,

    /// - Only informational.
    /// - *Fetched from* Reinsaat.
    /// - `Saattiefe` should be called `seed_planting_depth_de`
    /// - When sowing, each plant has a specific value how deep the seeds should be covered with soil.
    /// - *Fill ratio:* 5%
    //pub seed_planting_depth_de: Option<String>,

    /// - German version of thousand grain weight (German: Tausendkornmasse)
    /// - Only informational.
    /// - *Fetched from* Reinsaat.
    /// - Called `Tausendkornmasse` in Reinsaat
    /// - *Fill ratio:* 4%
    //pub seed_weight_1000_de: Option<String>,

    /// - English version of thousand grain weight (German: Tausendkornmasse)
    /// - Only informational.
    /// - *Fetched from* Reinsaat.
    /// - Called `Thousand seeds mass` in Reinsaat
    /// - *Fill ratio:* 3%
    //pub seed_weight_1000_en: Option<String>,
    */
    /// - Number for thousand grain weight (German: Tausendkornmasse)
    /// - *Used* in `doc/usecases/buy_seeds.md` to calculate seed weight based on number of plants.
    /// - *Fetched from* Permapeople as \`1000_seed_weight_g\` and renamed.
    /// - *TODO:* merge with data from reinsaat: `Tausendkorngewicht (TKG)` should be copied to `seed_weight` (remove ` g`)
    /// - *Fill ratio:* 4%
    pub seed_weight_1000: Option<f64>,
    /*
    /// - Only informational.
    /// - *Fetched from* Reinsaat.
    /// - `Suitable for professional cultivation` should be called `machine_cultivation_possible`
    /// - *Fill ratio:* 9%
    //pub machine_cultivation_possible: Option<bool>,

    /// - *Fetched from* Reinsaat.
    /// - *Used* for plant search and informational.
    /// - `subcategory` from Reinsaat should be copied to `edible_uses_de` and `edible_uses_en` respectively (DE and EN version)
    /// - *Fill ratio:* 6%
    //pub edible_uses_de: Option<String>,
    */
}
/// The `Seed` entity.
#[derive(Identifiable, Queryable)]
#[diesel(table_name = seeds)]
pub struct Seed {
    /// The record id of the seed.
    pub id: i32,
    /// An additional name for the seed.
    pub name: String,
    /// When the seeds were harvested.
    pub harvest_year: i16,
    /// When the seeds should be used by.
    pub use_by: Option<NaiveDate>,
    /// Where the seeds came from.
    pub origin: Option<String>,
    /// What the seeds taste like.
    pub taste: Option<String>,
    /// The yield of the seeds.
    pub yield_: Option<String>,
    /// How many seeds there are.
    pub quantity: Quantity,
    /// The quality of the seeds.
    pub quality: Option<Quality>,
    /// How much the seeds cost.
    pub price: Option<i16>,
    /// How many generations the seeds have been grown.
    pub generation: Option<i16>,
    /// Notes about the seeds.
    pub notes: Option<String>,
    /// The id of the plant this seed belongs to.
    pub plant_id: Option<i32>,
    /// The id of the creator of the seed.
    pub created_by: Uuid,
    /// Timestamp indicating when the seed was archived.
    /// Empty if the seed was not archived.
    pub archived_at: Option<NaiveDateTime>,
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
    pub created_by: Uuid,
}

/// The `Map` entity.
#[derive(Identifiable, Queryable)]
#[diesel(table_name = maps)]
pub struct Map {
    /// The id of the map.
    pub id: i32,
    /// The name of the map.
    pub name: String,
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
    pub privacy: PrivacyOption,
    /// The description of the map.
    pub description: Option<String>,
    /// The location of the map as a latitude/longitude point.
    pub location: Option<Point>,
    /// The id of the creator of the map.
    pub created_by: Uuid,
    /// The geometry of the map.
    pub geometry: Polygon<Point>,
    /// When the map was created.
    pub created_at: NaiveDateTime,
    /// When a map was last modified, e.g., by modifying plantings.
    pub modified_at: NaiveDateTime,
    /// By whom the map was last modified.
    pub modified_by: Uuid,
}

/// The `NewMap` entity.
#[derive(Insertable)]
#[diesel(table_name = maps)]
pub struct NewMap {
    /// The name of the map.
    pub name: String,
    /// For a new map the same as created_by.
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
    pub privacy: PrivacyOption,
    /// The description of the map.
    pub description: Option<String>,
    /// The location of the map as a latitude/longitude point.
    pub location: Option<Point>,
    /// The id of the creator of the map.
    pub created_by: Uuid,
    /// The geometry of the map.
    pub geometry: Polygon<Point>,
    /// The user who last modified the planting.
    pub modified_by: Uuid,
}

/// The `UpdateMap` entity.
#[derive(AsChangeset)]
#[diesel(table_name = maps)]
pub struct UpdateMap {
    /// The name of the map.
    pub name: Option<String>,
    /// An enum indicating if this map is private or not.
    pub privacy: Option<PrivacyOption>,
    /// The description of the map.
    pub description: Option<String>,
    /// The location of the map as a latitude/longitude point.
    pub location: Option<Point>,
}

/// The `UpdateMapGeometry` entity.
#[derive(AsChangeset)]
#[diesel(table_name = maps)]
pub struct UpdateMapGeometry {
    /// New Map Bounds
    pub geometry: Polygon<Point>,
}

/// The `Layer` entity.
#[derive(Identifiable, Queryable)]
#[diesel(table_name = layers)]
pub struct Layer {
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

/// The `NewLayer` entity.
#[derive(Insertable)]
#[diesel(table_name = layers)]
pub struct NewLayer {
    /// The id of the map this layer belongs to.
    pub map_id: i32,
    /// The type of layer.
    pub type_: LayerType,
    /// The name of the layer.
    pub name: String,
    /// A flag indicating if this layer is an user created alternative.
    pub is_alternative: bool,
}

/// The `BaseLayerImages` entity.
#[derive(Identifiable, Queryable, Insertable, AsChangeset)]
#[diesel(table_name = base_layer_images)]
pub struct BaseLayerImages {
    /// The id of the image.
    pub id: Uuid,
    /// The layer the image is on.
    pub layer_id: i32,
    /// The path to the image on Nextcloud.
    pub path: String,
    /// The rotation in degrees (0-360) of the image on the map.
    pub rotation: f32,
    /// The scale of the image on the map.
    pub scale: f32,
}

/// The `Users` entity.
#[derive(Insertable, Identifiable, Queryable)]
#[diesel(table_name = users)]
pub struct Users {
    /// The id of the user from Keycloak.
    pub id: Uuid,
    /// The preferred salutation of the user.
    pub salutation: Salutation,
    /// The title(s) of the user.
    pub title: Option<String>,
    /// The current country of the user.
    pub country: String,
    /// The phone number of the user.
    pub phone: Option<String>,
    /// The website of the user.
    pub website: Option<String>,
    /// The organization the user belongs to.
    pub organization: Option<String>,
    /// The experience level in permaculture of the user.
    pub experience: Option<Experience>,
    /// The membership type of the user.
    pub membership: Option<Membership>,
    /// A collection of years in which the user was a member.
    pub member_years: Option<Vec<Option<i32>>>,
    /// The date since when the user is a member.
    pub member_since: Option<NaiveDate>,
    /// The amount of permacoins the user earned in each year as a member.
    pub permacoins: Option<Vec<Option<i32>>>,
}

/// The `GuidedTours` entity.
#[derive(Insertable, Identifiable, Queryable)]
#[diesel(primary_key(user_id), table_name = guided_tours)]
pub struct GuidedTours {
    /// The id of the user from Keycloak.
    pub user_id: Uuid,
    /// A flag indicating if the Map Editor Guided Tour was completed.
    pub editor_tour_completed: bool,
}

/// The `UpdateGuidedTours` entity.
#[derive(AsChangeset)]
#[diesel(table_name = guided_tours)]
pub struct UpdateGuidedTours {
    /// A flag indicating if the Map Editor Guided Tour was completed.
    pub editor_tour_completed: Option<bool>,
}

/// The `Blossom` entity.
#[derive(Identifiable, Queryable)]
#[diesel(primary_key(title), table_name = blossoms)]
pub struct Blossom {
    /// The title of the Blossom.
    pub title: String,
    /// The description of the Blossom.
    pub description: Option<String>,
    /// The track the Blossom is part of.
    pub track: Track,
    /// The path to the icon of the Blossom in Nextcloud.
    pub icon: String,
    /// A flag indicating if this Blossom is repeatable every season.
    pub is_seasonal: bool,
}

/// The `GainedBlossoms` entity.
#[derive(Insertable, Identifiable, Queryable)]
#[diesel(primary_key(user_id, blossom), table_name = gained_blossoms)]
pub struct GainedBlossoms {
    /// The id of the user from Keycloak.
    pub user_id: Uuid,
    /// The title of the Blossom.
    pub blossom: String,
    /// The number of times this Blossom was gained by this user.
    pub times_gained: i32,
    /// The date on which the user gained this Blossom.
    pub gained_date: NaiveDate,
}
