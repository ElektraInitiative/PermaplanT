/**
 * This file contains the mapping between the German and English column names
 * of the Reinsaat dataset.
 *
 */
const mapping = {
  Artikelnummer: 'reinsaat_article_number',
  Portionsinhalt: 'reinsaat_portion_content',
  Direktsaat: 'sowing_outdoors_de',
  url: 'reinsaat_url',
  'Aussaat/ Pflanzung Freiland_datestable': 'sowing_outdoors',
  Ernte_datestable: 'harvest_time',
  Abstände: 'spacing_de',
  Saatgutbedarf: 'required_quantity_of_seeds_de',
  'Required quantity of seeds': 'required_quantity_of_seeds_en',
  Saattiefe: 'seed_planting_depth_de',
  Tausendkornmasse: '1000_seed_weight_de',
  'Thousand seeds mass': '1000_seed_weight_en',
  'Suitable for professional cultivation': 'machine_cultivation_possible',
  'subcategory DE': 'edible_uses_de',
  'subcategory EN': 'edible_uses_en',
  'Tausendkorngewicht (TKG)': '1000_seed_weight',
  Sowing: 'sowing_outdoors_en',
  Distances: 'spacing_en',
  'Sowing depth': 'seed_planting_depth_en',
  '1st harvest': 'days_to_harvest',
  Keimtemperatur: 'germination_temperature',
  'Scientific name': 'scientific_name',
};

export default mapping;
