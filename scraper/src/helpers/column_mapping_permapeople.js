/**
 * This file contains the mapping between the PermaPeople column names and the
 * column names of the database.
 *
 * Key is the permapeople column name.
 * Value is an object with the following properties:
 * - map: The name of the column in the database.
 * - priority: The priority of the column. If there are multiple sources for
 *  the same column, the one with the highest priority will be used.
 * - newName: The final name of the column in the database.
 * - valueMapping: A translation table for the values of the column
 *    to unify the values in both datasets.
 *    Each key is a source value and the value is the target value
 *    i.e. key will be replaced by value.
 *    For example, replace 'partial sun' with 'Partial sun/shade'.
 *
 * If the value is null, there is no mapping for this column and it will be
 * taken from the source as is.
 */
export default {
  id: {
    newName: "external_id",
  },
  name: {
    map: "common_name",
    priority: "permapeople",
    newName: "common_name_en",
  },
  slug: null,
  description: null,
  created_at: null,
  updated_at: null,
  scientific_name: {
    map: "binomial_name",
    priority: "permapeople",
    newName: "unique_name",
  },
  parent_id: null,
  version: null,
  type: null,
  link: {
    map: "external_url",
  },
  wildflower: null,
  usda_hardiness_zone: {
    map: "hardiness_zone",
    priority: "permapeople",
    newName: "hardiness_zone",
  },
  life_cycle: {
    map: "life_cycle",
    priority: "permapeople",
    newName: "life_cycle",
    valueMapping: {
      annual: "annual",
      biennial: "biennial",
      perennial: "perennial",
    },
  },
  light_requirement: {
    map: "sun",
    priority: "permapeople",
    newName: "light_requirement",
    valueMapping: {
      "full sun": "Full sun",
      "partial sun": "Partial sun/shade",
      "indirect sun": "Full shade",
    },
  },
  water_requirement: {
    map: "water",
    priority: "permapeople",
    newName: "water_requirement",
    valueMapping: {
      low: "Dry",
      moderate: "Moist",
      high: "Wet",
      aquatic: "Water",
      dry: "Dry",
      moist: "Moist",
      wet: "Wet",
      water: "Water",
      "well-drained": null,
      "wet to moist": null,
    },
  },
  soil_type: {
    map: "soil_texture",
    priority: "permapeople",
    newName: "soil_texture",
    valueMapping: {
      "light (sandy)": "sandy",
      medium: "loamy",
      "heavy (clay)": "clay",
      "rich in humus": null,
      "well draining": null,
    },
  },
  height: {
    map: "mature_size_height",
    priority: "permapeople",
    newName: "height",
  },
  layer: {
    newName: "habitus",
  },
  edible_parts: null,
  propagation_method: null,
  wikipedia: {
    newName: "wikipedia_url",
  },
  growth: {
    map: "growth_rate",
    priority: "permapeople",
    newName: "growth_rate",
    valueMapping: {
      slow: "slow",
      medium: "moderate",
      fast: "vigorous",
    },
  },
  alternate_name: null,
  family: {
    map: "family",
    priority: "permapeople",
    newName: "family",
  },
  german_name: {
    map: "common_name_de",
    priority: "practicalplants",
    newName: "common_name_de",
  },
  edible_uses: {
    map: "edible_uses",
    priority: "permapeople",
    newName: "edible_uses_en",
  },
  plants_for_a_future: null,
  medicinal: {
    map: "medicinal_uses",
    priority: "permapeople",
    newName: "medicinal_uses",
  },
  soil_ph: {
    map: "soil_ph",
    priority: "permapeople",
    newName: "soil_ph",
  },
  propagation_transplanting: {
    newName: "propagation_transplanting_en",
  },
  germination_time: null,
  when_to_sow_outdoors: {
    newName: "sowing_outdoors_en",
  },
  utility: null,
  edible: null,
  native_to: null,
  introduced_into: null,
  plants_of_the_world_online_link: null,
  plants_of_the_world_online_name_synonym: null,
  plants_of_the_world_online_link_synonym: null,
  seed_viability: null,
  when_to_plant_transplant: {
    newName: "when_to_plant_transplant_en",
  },
  days_to_maturity: null,
  spacing: {
    newName: "spacing_en",
  },
  germination_temperature: null,
  when_to_start_outdoors_weeks: null,
  days_to_harvest: null,
  when_to_sow_indoors: {
    newName: "when_to_sow_indoors_en",
  },
  "1000_seed_weight_g": {
    newName: "seed_weight_1000",
  },
  seed_planting_depth: {
    newName: "seed_planting_depth_en",
  },
  dutch_name: null,
  leaves: {
    map: "deciduous_or_evergreen",
    priority: "practicalplants",
    newName: "deciduous_or_evergreen",
  },
  warning: null,
  root_type: null,
  when_to_plant_cuttings: {
    newName: "when_to_plant_cuttings_en",
  },
  drought_resistant: {
    map: "has_drought_tolerance",
    priority: "practicalplants",
    newName: "has_drought_tolerance",
  },
  habitat: null,
  cold_stratification_temperature: null,
  cold_stratification_time: null,
  genus: {
    map: "genus",
    priority: "permapeople",
    newName: "genus",
  },
  danish_name: null,
  root_depth: {
    map: "root_zone_tendency",
    priority: "permapeople",
    newName: "root_depth",
  },
  medicinal_parts: null,
  when_to_plant_division: {
    newName: "when_to_plant_division_en",
  },
  propagation_direct_sowing: null,
  when_to_harvest: null,
  when_to_start_indoors_weeks: null,
  spread: {
    map: "spread",
    priority: "permapeople",
    newName: "spread",
  },
  pollination: {
    map: "pollinators",
    priority: "permapeople",
    newName: "pollination",
  },
  pests: null,
  diseases: null,
  propagation_cuttings: null,
  french_name: null,
  alternate_scientific_name: null,
  hortipedia: null,
  invasive_in: null,
  years_to_bear: null,
  useful_tropical_plants: null,
  thinning: null,
  resistance: null,
  light_tolerance: null,
  chill_hours: null,
  beef_tomato: null,
  invasive: null,
};
