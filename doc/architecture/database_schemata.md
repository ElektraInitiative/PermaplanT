# Database Schemata

Tag and Quality in this case are enum.
Postgres supports [enums](https://www.postgresql.org/docs/current/datatype-enum.html) so it is easy to define a static set of values.
Right now, Mermaid doesn't support enum types so a `_` character denotes white spaces in enums.

# ER Diagram

```mermaid
erDiagram

enum_tag {
  VARCHAR Leaf_crops
  VARCHAR Fruit_crops
  VARCHAR Root_crops
  VARCHAR Flowering_crops
  VARCHAR Herbs
  VARCHAR Other
}

enum_quantity {
  VARCHAR Nothing
  VARCHAR Not_enough
  VARCHAR Enough
  VARCHAR More_than_enough
}

enum_quality {
  VARCHAR Organic
  VARCHAR Not_organic
  VARCHAR Unknown
}

seeds {
  INT id PK
  tags tag "NOT NULL"
  INT plant_id "NOT NULL"
  SMALLINT harvest_year "NOT NULL"
  DATE use_by
  VARCHAR origin
  VARCHAR flavor
  INT yield
  INT quantity
  quality quality
  MONEY price
  INT generation
  VARCHAR notes
}

plants {
  INT id PK
  tags tag "NOT NULL"
  VARCHAR type "NOT NULL"
  VARCHAR synonym
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
  VARCHAR location
  VARCHAR care
  INT height
}

plant_detail{}

plants }o--|| plant_detail: "type"

plants ||--o{ seeds : ""

plant_detail }o--o{ plant_detail: "likes"

plant_detail }o--o{ plant_detail: "dislikes"

```



```mermaid
erDiagram

enum_water {
  VARCHAR low
  VARCHAR moderate
  VARCHAR high
  VARCHAR aquatic
}
enum_water {
  VARCHAR low
  VARCHAR moderate
  VARCHAR high
  VARCHAR aquatic
}

enum_sun { 
  VARCHAR indirect_sun
  VARCHAR partial_sun
  VARCHAR full_sun
}

enum_shade {
  VARCHAR no_shade
  VARCHAR light_shade
  VARCHAR partial_shade
  VARCHAR permanent_shade
  VARCHAR permanent_deep_shade
}

enum_soil_ph {
  VARCHAR very_acid
  VARCHAR acid
  VARCHAR neutral
  VARCHAR alkaline
  VARCHAR very_alkaline
}

enum_soil_texture {
  VARCHAR sandy
  VARCHAR loamy
  VARCHAR clay
  VARCHAR heavy_clay
}

enum_soil_water_retention {
  VARCHAR well_drained
  VARCHAR moist
  VARCHAR wet
}

enum_life_cycle {
  VARCHAR annual
  VARCHAR biennial
  VARCHAR perennial
}

enum_growth_rate {
  VARCHAR slow
  VARCHAR moderate
  VARCHAR vigorous
}

enum_flower_type {
  VARCHAR dioecious
  VARCHAR monoecious
  VARCHAR hermaphrodite
}

enum_fertility {
  VARCHAR self_fertile
  VARCHAR self_sterile
}

enum_herbaceous_or_woody {
  VARCHAR herbaceous
  VARCHAR woody
}

enum_deciduous_or_evergreen {
  VARCHAR deciduous
  VARCHAR evergreen
}

enum_root_zone_tendency {
  VARCHAR surface
  VARCHAR shallow
  VARCHAR deep
}

enum_nutrition_demand {
  VARCHAR light_feeder
  VARCHAR moderate_feeder
  VARCHAR heavy_feeder
}

plant_detail{
  id INT PK
  binomial_name VARCHAR "NOT NULL"
  common_name TEXT[]
  common_name_de TEXT[]
  genus VARCHAR
  family VARCHAR
  subfamily VARCHAR
  edible_uses VARCHAR
  medicinal_uses VARCHAR
  material_uses_and_functions VARCHAR
  botanic VARCHAR
  propagation VARCHAR
  cultivation VARCHAR
  environment VARCHAR
  material_uses VARCHAR
  functions VARCHAR
  provides_forage_for VARCHAR
  provides_shelter_for VARCHAR
  hardiness_zone SMALLINT
  heat_zone SMALLINT
  water WATER
  sun SUN
  shade VARCHAR
  soil_ph SOIL_PH[]
  soil_texture SOIL_TEXTURE[]
  soil_water_retention SOIL_WATER_RETENTION[]
  environmental_tolerances TEXT[]
  native_climate_zones VARCHAR
  adapted_climate_zones VARCHAR
  native_geographical_range VARCHAR
  native_environment VARCHAR
  ecosystem_niche VARCHAR
  root_zone_tendancy ROOT_ZONE_TENDANCY
  deciduous_or_evergreen DECIDUOUS_OR_EVERGREEN
  herbaceous_or_woody HERBACEOUS_OR_WOODY
  life_cycle LIFE_CYCLE[]
  growth_rate GROWTH_RATE
  mature_size_height VARCHAR
  mature_size_width VARCHAR
  fertility FERTILITY[]
  pollinators VARCHAR
  flower_colour VARCHAR
  flower_type FLOWER_TYPE
  created_at TIMESTAMP "NOT NULL"
  updated_at TIMESTAMP "NOT NULL"
  has_drought_tolerance BOOLEAN
  tolerates_wind BOOLEAN
  plant_references TEXT[]
  is_tree BOOLEAN
  nutrition_demand NUTRITION_DEMAND
  preferable_permaculture_zone SMALLINT
}

```

# Table descriptions

## `Plant_detail`

| **_Column name_**                | **_Example_**                    | **_Description_**                                   |
| :------------------------------- | :------------------------------- | :-------------------------------------------------- |
| **id**                           | 1                                |
| **binomial_name**                | Abelia triflora                  |
| **common_name**                  | NULL                             |
| **common_name_de**               | NULL                             |
| **family**                       | Caprifoliaceae                   |
| **subfamily**                    | NULL                             |
| **genus**                        | Abelia                           |
| **edible_uses**                  | NULL                             |
| **medicinal_uses**               | NULL                             |
| **material_uses_and_functions**  | \[1\]\[2\]                       |
| **botanic**                      | \[3\]\[6\]                       |
| **propagation**                  | NULL                             |
| **cultivation**                  | NULL                             |
| **environment**                  | NULL                             |
| **material_uses**                | NULL                             |
| **functions**                    | NULL                             |
| **provides_forage_for**          | NULL                             |
| **provides_shelter_for**         | NULL                             |
| **hardiness_zone**               | 6                                |
| **heat_zone**                    | NULL                             |
| **water**                        | moderate                         |
| **sun**                          | full sun                         |
| **shade**                        | light shade                      |
| **soil_ph**                      | {neutral,alkaline,very alkaline} |
| **soil_texture**                 | {sandy,loamy}                    |
| **soil_water_retention**         | NULL                             |
| **environmental_tolerances**     | NULL                             |
| **native_climate_zones**         | NULL                             |
| **adapted_climate_zones**        | NULL                             |
| **native_geographical_range**    | NULL                             |
| **native_environment**           | NULL                             |
| **ecosystem_niche**              | NULL                             |
| **root_zone_tendancy**           | NULL                             |
| **deciduous_or_evergreen**       | deciduous                        |
| **herbaceous_or_woody**          | woody                            |
| **life_cycle**                   | {perennial}                      |
| **growth_rate**                  | slow                             |
| **mature_size_height**           | 3.5                              |
| **mature_size_width**            | 3                                |
| **fertility**                    | NULL                             |
| **pollinators**                  | NULL                             |
| **flower_colour**                | NULL                             |
| **flower_type**                  | hermaphrodite                    |
| **created_at**                   | 2023-02-09 14:06:01.451028       |
| **updated_at**                   | 2023-02-09 14:06:01.451028       |
| **has_drought_tolerance**        | false                            |
| **tolerates_wind**               | false                            |
| **plant_references**             | {ref1, ref2)}                    |
| **is_tree**                      | true                             | Herbaceous/Woody (woody) AND life cycle (perennial) |
| **nutrition_demand**             | NULL                             |
| **preferable_permaculture_zone** | NULL                             | -1..6 (-1 should be printed as 00)                  |
