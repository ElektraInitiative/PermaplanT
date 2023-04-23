/**
 * This file contains the database columns and their corresponding types
 */
export default [
  { name: 'common_name_en', cast: 'text[]' },
  { name: 'common_name_de', cast: 'text[]' },
  { name: 'unique_name' },
  { name: 'genus' },
  { name: 'family' },
  { name: 'subfamily' },
  { name: 'edible_uses_en' },
  { name: 'medicinal_uses' },
  { name: 'material_uses_and_functions' },
  { name: 'botanic' },
  { name: 'material_uses' },
  { name: 'functions' },
  { name: 'heat_zone' },
  { name: 'shade' },
  { name: 'soil_ph', cast: 'soil_ph[]' },
  { name: 'soil_texture', cast: 'soil_texture[]' },
  { name: 'soil_water_retention', cast: 'soil_water_retention[]' },
  { name: 'environmental_tolerances', cast: 'text[]' },
  { name: 'native_geographical_range' },
  { name: 'native_environment' },
  { name: 'ecosystem_niche' },
  { name: 'deciduous_or_evergreen', cast: 'deciduous_or_evergreen' },
  { name: 'herbaceous_or_woody', cast: 'herbaceous_or_woody' },
  { name: 'life_cycle', cast: 'life_cycle[]' },
  { name: 'growth_rate', cast: 'growth_rate[]' },
  { name: 'height' },
  { name: 'width' },
  { name: 'fertility', cast: 'fertility[]' },
  { name: 'pollinators' },
  { name: 'flower_colour' },
  { name: 'flower_type', cast: 'flower_type' },
  { name: 'has_drought_tolerance', cast: 'boolean' },
  { name: 'tolerates_wind' },
  { name: 'plant_references', cast: 'text[]' },
  { name: 'is_tree' },
  { name: 'nutrition_demand', cast: 'nutrition_demand' },
  { name: 'article_last_modified_at' },
  { name: 'hardiness_zone' },
  { name: 'light_requirement', cast: 'light_requirement[]' },
  { name: 'water_requirement', cast: 'water_requirement[]' },
  { name: 'propagation_method', cast: 'propagation_method[]' },
  { name: 'alternate_name' },
  { name: 'diseases' },
  { name: 'edible', cast: 'boolean' },
  { name: 'edible_parts', cast: 'text[]' },
  { name: 'germination_temperature' },
  { name: 'introduced_into' },
  { name: 'habitus' },
  { name: 'leaves' },
  { name: 'medicinal_parts' },
  { name: 'native_to' },
  { name: 'plants_for_a_future' },
  { name: 'plants_of_the_world_online_link' },
  { name: 'plants_of_the_world_online_link_synonym' },
  { name: 'pollination' },
  { name: 'propagation_transplanting' },
  { name: 'resistance' },
  { name: 'root_type' },
  { name: 'seed_planting_depth_en' },
  { name: 'seed_viability' },
  { name: 'slug' },
  { name: 'spread' },
  { name: 'utility' },
  { name: 'warning' },
  { name: 'when_to_plant_cuttings' },
  { name: 'when_to_plant_division' },
  { name: 'when_to_plant_transplant' },
  { name: 'when_to_sow_indoors' },
  { name: 'sowing_outdoors_en' },
  { name: 'when_to_start_indoors_weeks' },
  { name: 'when_to_start_outdoors_weeks' },
  { name: 'cold_stratification_temperature' },
  { name: 'cold_stratification_time' },
  { name: 'days_to_harvest' },
  { name: 'habitat' },
  { name: 'spacing_en' },
  { name: 'wikipedia' },
  { name: 'days_to_maturity' },
  { name: 'pests' },
  { name: 'version' },
  { name: 'germination_time' },
  { name: 'description' },
  { name: 'parent_id' },
  { name: 'external_source' },
  { name: 'external_id' },
  { name: 'external_url' },
  { name: 'root_depth' },
  { name: 'external_article_number' },
  { name: 'external_portion_content' },
  { name: 'sowing_outdoors_de' },
  { name: 'sowing_outdoors' },
  { name: 'harvest_time' },
  { name: 'spacing_de' },
  { name: 'required_quantity_of_seeds_de' },
  { name: 'required_quantity_of_seeds_en' },
  { name: 'seed_planting_depth_de' },
  { name: 'seed_weight_1000_de' },
  { name: 'seed_weight_1000_en' },
  { name: 'seed_weight_1000' },
  { name: 'machine_cultivation_possible' },
  { name: 'edible_uses_de' },
];
