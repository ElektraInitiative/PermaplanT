# ER diagram

```mermaid
erDiagram

seeds {
  INT id PK
  INT plant_id "NOT NULL"
  TEXT name "NOT NULL"
  SMALLINT harvest_year "NOT NULL"
  DATE use_by
  TEXT origin
  TEXT taste
  TEXT yield
  TEXT variety
  QUANTITY quantity
  QUALITY quality
  INT price
  INT generation
  TEXT notes
  INT owner_id "NOT NULL"
}

plants {
  INT id PK
  TEXT unique_name "NOT NULL"
  TEXT[] common_name_en
  TEXT[] common_name_de
  TEXT family
  TEXT edible_uses_en
  TEXT functions
  SMALLINT heat_zone
  SHADE shade
  SOIL_PH[] soil_ph
  SOIL_TEXTURE[] soil_texture
  TEXT ecosystem_niche
  DECIDUOUS_OR_EVERGREEN deciduous_or_evergreen
  HERBACEOUS_OR_WOODY herbaceous_or_woody
  LIFE_CYCLE[] life_cycle
  GROWTH_RATE[] growth_rate
  PLANT_HEIGHT plant_height
  FERTILITY[] fertility
  TIMESTAMP created_at
  TIMESTAMP updated_at
  BOOLEAN has_drought_tolerance
  BOOLEAN tolerates_wind
  SMALLINT preferable_permaculture_zone
  TEXT hardiness_zone
  LIGHT_REQUIREMENT[] light_requirement
  WATER_REQUIREMENT[] water_requirement
  PROPAGATION_METHOD[] propagation_method
  TEXT alternate_name
  BOOLEAN edible
  TEXT[] edible_parts
  PLANT_SPREAD spread
  TEXT warning
  SMALLINT version
  EXTERNAL_SOURCE external_source
  SMALLINT[] sowing_outdoors
  SMALLINT[] harvest_time
  DOUBLE seed_weight_1000
}


relations {
  INT plant1 PK
  INT plant2 PK
  RELATION_TYPE relation "NOT NULL"
  TEXT note
}




maps {
  INT id PK
  TEXT name "NOT NULL"
  DATE creation_date "NOT NULL"
  DATE deletion_date
  DATE last_visit
  BOOLEAN is_inactive "NOT NULL"
  INT zoom_factor "NOT NULL"
  INT honors "NOT NULL"
  INT visits "NOT NULL"
  INT harvested "NOT NULL"
  PRIVACY_OPTION privacy "NOT NULL"
  TEXT description
  GEOGRAPHY location
  INT owner_id "NOT NULL"
  GEOMETRY geometry "NOT NULL"

}

layers {
  INT id PK
  INT map_id "NOT NULL"
  LAYER_TYPES type "NOT NULL"
  TEXT name "NOT NULL"
  BOOLEAN is_alternative "NOT NULL"
}


plantings {
    INT id PK
    INT layer_id "NOT NULL"
    INT plant_id "NOT NULL"
    INT x "NOT NULL"
    INT y "NOT NULL"
    INT width "NOT NULL"
    INT height "NOT NULL"
    REAL rotation "NOT NULL"
    REAL scale_x "NOT NULL"
    REAL scale_y "NOT NULL"
    DATE add_date
    DATE remove_date
}


users {
  UUID id PK
  SALUTATION salutation "NOT NULL"
  TEXT title
  TEXT country "NOT NULL"
  TEXT phone
  TEXT website
  TEXT organization
  EXPERIENCE experience
  MEMBERSHIP membership
  INT[] member_years
  DATE member_since
  INT[] permacoins
}

guided_tours {
  UUID user_id PK
  BOOLEAN editor_tour "NOT NULL"
}

blossoms {
  TEXT title PK
  TEXT description
  TRACKS track
  TEXT icon
  BOOLEAN is_seasonal "NOT NULL"
}


blossoms_gained {
  UUID user_id PK
  TEXT blossom "NOT NULL"
  INT times_gained "NOT NULL"
  DATE gained_date "NOT NULL"
}

base_layer_images {
  UUID id PK
  INT layer_id "NOT NULL"
  TEXT path "NOT NULL"
  REAL rotation "NOT NULL"
  REAL scale "NOT NULL"
}


plants ||--o{ seeds : ""
relations }o--|| plants : "plant1"
relations }o--|| plants : "plant2"
layers }|--|| maps : ""
plantings }o--|| layers : ""
plantings }o--|| plants : ""
maps }o--|| users : "owned by"
blossoms ||--o{ blossoms_gained : ""












```

## Plants Table

For performance reasons, we decided to disable some unused columns in the plants table for now.

For more information, see: [PR #644](https://github.com/ElektraInitiative/PermaplanT/pull/644)

The following columns are commented out for now:

- genus: text
- medicinal_uses: text
- material_uses_and_functions: text
- botanic: text
- material_uses: text
- soil_water_retention: soil_water_retention[]
- environmental_tolerances: text[]
- native_geographical_range: text
- native_environment: text
- flower_colour: text
- flower_type: flower_type
- plant_references: text[]
- is_tree: boolean
- nutrition_demand: nutrition_demand
- article_last_modified_at: timestamp without time zone
- diseases: text
- germination_temperature: text
- introduced_into: text
- habitus: text
- medicinal_parts: text
- native_to: text
- plants_for_a_future: text
- plants_of_the_world_online_link: text
- plants_of_the_world_online_link_synonym: text
- pollination: text
- propagation_transplanting_en: text
- resistance: text
- root_type: text
- seed_planting_depth_en: text
- seed_viability: text
- slug: text
- utility: text
- when_to_plant_cuttings_en: text
- when_to_plant_division_en: text
- when_to_plant_transplant_en: text
- when_to_sow_indoors_en: text
- sowing_outdoors_en: text
- when_to_start_indoors_weeks: text
- when_to_start_outdoors_weeks: text
- cold_stratification_temperature: text
- cold_stratification_time: text
- days_to_harvest: text
- habitat: text
- spacing_en: text
- wikipedia_url: text
- days_to_maturity: text
- pests: text
- germination_time: text
- description: text
- parent_id: text
- external_id: text
- external_url: text
- root_depth: text
- external_article_number: text
- external_portion_content: text
- sowing_outdoors_de: text
- spacing_de: text
- required_quantity_of_seeds_de: text
- required_quantity_of_seeds_en: text
- seed_planting_depth_de: text
- seed_weight_1000_de: text
- seed_weight_1000_en: text
- machine_cultivation_possible: boolean
- edible_uses_de: text

<!--

These are leftovers from the old ER diagram.
We'll keep them for now. We will create new issues in the near future for them.
These will be implemented, when we implement UC [Ingredient_list](./doc/usecases/assigned/ingredient_lists.md), UC [watering_layer](./doc/usecases/assigned/watering_layer.md) and UC [map_timeline_event_view](./doc/usecases/assigned/map_timeline_event_view.md)

ingredientLists_WIP {
  INT id PK
  TEXT name "NOT NULL"
  TEXT description
  BYTEA image
  BOOLEAN is_recurring "NOT NULL"
  DATE end_date "NOT NULL"
  INT accomplished
}

ingredients_WIP {
  BOOLEAN is_fulfilled "NOT NULL"
}

events {
  INT id PK
  BOOLEAN system_event "NOT NULL"
  TEXT name "NOT NULL"
  TEXT description
  DATE event_date "NOT NULL"
}

favorites {}


ingredientLists }o--|| users : ""
ingredientLists }o--|| maps : ""
ingredients }|--|| ingredientLists : ""
ingredients }|--|| plants : ""
events }o--|| maps : ""
favorites }o--|| maps : ""
favorites }o--|| plants : ""

 -->

   <!--
  Leftover column from seeds, but not implemented, still needed?
  seeds
  tags tag "NOT NULL" -->

<!--
  plants
  Leftover column from plants, but not implemented, still needed?

  tags tag "NOT NULL"
  TEXT type "NOT NULL"
  TEXT synonym
  SMALLINT sowing_from
  SMALLINT sowing_to
  INT sowing_depth
  INT germination_temperature
  BOOLEAN prick_out
  DATE transplant
  INT row_spacing
  INT plant_density
  INT germination_time
  INT harvest_time
  TEXT location
  TEXT care
-->

  <!--
  Leftover column from maps, but not implemented, still needed?
  maps
   DATE inactivity_date -->

   <!--#
   plantings - should be both DATETIME and add_date should have NOW()
    DATE add_date
    DATE remove_date

    -->
