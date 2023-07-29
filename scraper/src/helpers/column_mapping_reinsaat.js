/**
 * This file contains the mapping between the German and English column names
 * of the Reinsaat dataset.
 *
 */
const mapping = {
  Artikelnummer: "external_article_number",
  Portionsinhalt: "external_portion_content",
  Direktsaat: "sowing_outdoors_de",
  url: "external_url",
  "Aussaat/ Pflanzung Freiland_datestable": "sowing_outdoors",
  Ernte_datestable: "harvest_time",
  Abstände: "spacing_de",
  Saatgutbedarf: "required_quantity_of_seeds_de",
  "Required quantity of seeds": "required_quantity_of_seeds_en",
  Saattiefe: "seed_planting_depth_de",
  Tausendkornmasse: "seed_weight_1000_de",
  "Thousand seeds mass": "seed_weight_1000_en",
  "Suitable for professional cultivation": "machine_cultivation_possible",
  "subcategory DE": "edible_uses_de",
  "subcategory EN": "edible_uses_en",
  "Tausendkorngewicht (TKG)": "seed_weight_1000",
  Sowing: "sowing_outdoors_en",
  Distances: "spacing_en",
  "Sowing depth": "seed_planting_depth_en",
  "1st harvest": "days_to_harvest",
  Keimtemperatur: "germination_temperature",
  "Scientific name": "scientific_name",
};

export default mapping;
