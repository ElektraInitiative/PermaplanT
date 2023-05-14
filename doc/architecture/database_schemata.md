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

species{}
genus{}
subfamily{}
family{}

relation{}

plant_detail }|--|| species : ""
plant_detail }|--|| genus : ""
plant_detail }|--|| subfamily : ""
plant_detail }|--|| family : ""

maps {
  INT id PK
  VARCHAR name "NOT NULL"
  BOOLEAN is_inactive "NOT NULL"
  DATE last_visit
  INT honors
  INT visits
  INT harvested
  DATE creation_date
  DATE deletion_date
  DATE inactivity_date
  INT zoom_factor
  GEOGRAPHY geo_data
}

users {
  INT id PK
  VARCHAR nc_uid
  DATE contributor_until
  VARCHAR app_language
  DATE member_since
  INT[] member_years
  EXPERIENCE experience
  VARCHAR preferences
  GEOGRAPHY location
  INT[] permacoins
}

blossoms {
  INT id PK
  VARCHAR title
  VARCHAR description
  VARCHAR condition
  TRACKS track
  BYTEA icon
  BOOLEAN is_seasonal
}

enum_tracks {
  VARCHAR beginners_track
  VARCHAR seasonal_track
  VARCHAR completionist_track
  VARCHAR expert_track
}

enum_experience {
  VARCHAR beginner
  VARCHAR advanced
  VARCHAR expert
}

blossoms_gained {
  INT id PK
  INT times_gained
  DATE[] gained_date
}

maps }o--|| users : "owned by"
blossoms ||--o{ blossoms_gained : ""
blossoms_gained }o--|| users : ""

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

## `Maps`

| **_Column name_**                | **_Example_**                    | **_Description_**                  |
| :------------------------------- | :------------------------------- | :----------------------------------|
| **id**                           | 1                                |
| **owner_id**                     | 1                                |
| **name**                         | My Map                           | only alphanumerical values
| **is_inactive**                  | false                            |
| **last_visit**                   | 2023-04-04                       |
| **honors**                       | 0                                | 0 to infinity
| **visits**                       | 0                                | 0 to infinity
| **harvested**                    | 0                                | 0 to infinity, amount of plants harvested on this map
| **version_date**                 | 2023-04-04                       | the date the snapshot for this version was taken
| **creation_date**                | 2023-04-04                       |
| **deletion_date**                | 2023-04-04                       |
| **inactivity_date**              | 2023-04-04                       |
| **zoom_factor**                  | 100                              | value used in formula "X by X cm", e.g. 100 would mean "100 x 100 cm", range from 10 to 100000
| **geo_data**                     | NULL                             | PostGis Geodata, location of the map

## `Users`

| **_Column name_**                | **_Example_**                    | **_Description_**                  |
| :------------------------------- | :------------------------------- | :----------------------------------|
| **id**                           | 1                                |
| **nc_uid**                       | 1                                | Nextcloud ID
| **contributor_until**            | 2023-04-04                       | has contributing membership until the given date
| **app_language**                 | English                          |
| **member_since**                 | 2023-04-04                       |
| **member_years**                 | {2023}                           | Array of years
| **experience**                   | beginner                         |
| **preferences**                  | raised vegetable beds            |
| **location**                     | Vienna, Austria                  |
| **permacoins**                   | {0}                              | 0 to infinity, one entry for every year since account creation

## `Blossoms`

| **_Column name_**                | **_Example_**                    | **_Description_**                  |
| :------------------------------- | :------------------------------- | :----------------------------------|
| **id**                           | 1                                |
| **title**                        | Novice Gardener                  |
| **description**                  | Plant your first plant           |
| **condition**                    | plants.count() >= 1              | condition used to check if milestone is reached
| **track**                        | Beginners Track                  | the track (category) this blossom belongs to
| **icon**                         | NULL                             |
| **is_seasonal**                  | false                            | resets and repeats every year

## `Blossoms Gained`

| **_Column name_**                | **_Example_**                    | **_Description_**                  |
| :------------------------------- | :------------------------------- | :----------------------------------|
| **id**                           | 1                                |
| **user_id**                      | 1                                |
| **blossom_id**                   | 1                                |
| **times_gained**                 | 1                                | 0 to infinity
| **gained_date**                  | {2023-04-10}                     | one entry for every time gained

## `Relation`

Many-to-many table to store relations between plants, genus, subfamily and family.

| **_Column name_**     | **_Example_**              | **_Description_**                                                             |
| :-------------------- | :------------------------- | :---------------------------------------------------------------------------- |
| **id**                | 1                          | relation id                                                                   |
| **from_id**           | 1                          | id of the left side of the relation(id of plant, genus, subfamily or family)  |
| **from_type**         | genus                      | type can be plant, genus, subfamily or family                                 |
| **to_id**             | 1                          | id of the right side of the relation(id of plant, genus, subfamily or family) |
| **to_type**           | family                     | type can be plant, genus, subfamily or family                                 |
| **relation_type**     | companion                  | type of the relation can be companion, antagonist, neutral                    |
| **relation_strength** | 2                          | strength of the relation, can be 0 to 3                                       |
| **created_at**        | 2023-02-09 14:06:01.451028 | creation timestamp                                                            |
| **updated_at**        | 2023-02-09 14:06:01.451028 | update timestamp                                                              |

# Example queries

## Get all plants with their hierarchy information

```sql
SELECT *
  FROM plant_detail
  LEFT JOIN genus
            ON plant_detail.genus = genus.name
  LEFT JOIN subfamily
            ON plant_detail.subfamily = subfamily.name
  LEFT JOIN family
            ON plant_detail.family = family.name;
```

## Insert a relation between a plant with a specific genus and a specific family

```sql
INSERT INTO relations (from_id, from_type, to_id, to_type, relation_type, relation_strength)
VALUES (1, 'genus', 156, 'family', 'companion', 3);
```

## Get all plants that are companions to a specific family

```sql
SELECT p.id,
       p.binomial_name,
       p.genus,
       p.family,
       p.subfamily,
       r.*
  FROM plant_detail p
  LEFT JOIN genus
            ON p.genus = genus.name
  LEFT JOIN subfamily
            ON p.subfamily = subfamily.name
  LEFT JOIN family
            ON p.family = family.name
  JOIN relations r
       ON r.relation_type = 'companion' AND r.to_type = 'family' AND r.to_id = 156 AND
          CASE
              WHEN r.from_type = 'plant' THEN r.id = p.id
              WHEN r.from_type = 'genus' THEN r.id = genus.id
              WHEN r.from_type = 'subfamily' THEN r.id = subfamily.id
              WHEN r.from_type = 'family' THEN r.id = family.id
              END;
```
