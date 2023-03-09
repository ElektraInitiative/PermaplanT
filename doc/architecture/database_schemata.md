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

species{}
genus{}
subfamily{}
family{}

plant_detail }|--|| species : ""
species }|--|| genus : ""
genus }|--|| subfamily : ""
subfamily }|--|| family : ""




```

# Table descriptions

## `Plant_detail`

| **_Column name_**                | **_Example_**                    | **_Initial rule_**                                                                                | **_Description_**                  |
| :------------------------------- | :------------------------------- | :------------------------------------------------------------------------------------------------ | :--------------------------------- |
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
| **is_tree**                      | true                             | Set of Herbaceous/Woody (woody) AND life cycle (perennial)                                        |
| **nutrition_demand**             | NULL                             | If "Nutritionally poor soil" in `environmental_tolerances` is given `light feeder` should be set. |
| **preferable_permaculture_zone** | NULL                             |                                                                                                   | -1..6 (-1 should be printed as 00) |

# Example queries

## Get all plants with their hierarchy information

```sql
SELECT *
  FROM plant_detail
  LEFT JOIN genus
            ON plant_detail.genus_id = genus.id
  LEFT JOIN subfamily
            ON plant_detail.subfamily_id = subfamily.id
  LEFT JOIN family
            ON plant_detail.family_id = family.id;
```

## Insert a relation between a plant with a specific genus and a specific family

```sql
INSERT INTO relations (from_id, from_type, to_id, to_type, relation_type)
VALUES (1, 'genus', 156, 'family', 'dislikes');
```

## Get all plants that dislike a specific family

```sql
SELECT p.id,
       p.binomial_name,
       p.genus,
       p.genus_id,
       p.family,
       p.family_id,
       p.subfamily,
       p.subfamily_id,
       r.*
  FROM plant_detail p
  LEFT JOIN genus
            ON p.genus_id = genus.id
  LEFT JOIN subfamily
            ON p.subfamily_id = subfamily.id
  LEFT JOIN family
            ON p.family_id = family.id
  JOIN relations r
       ON r.relation_type = 'dislikes' AND r.to_type = 'family' AND r.to_id = 156 AND
          CASE
              WHEN r.from_type = 'plant' THEN r.id = p.id
              WHEN r.from_type = 'genus' THEN r.id = genus.id
              WHEN r.from_type = 'subfamily' THEN r.id = subfamily.id
              WHEN r.from_type = 'family' THEN r.id = family.id
              END
```
