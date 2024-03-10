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

## `Relations`

Store relations between plants.

| **_Column name_** | **_Example_**                         | **_Description_**               |
| :---------------- | :------------------------------------ | :------------------------------ |
| **plant1**        | 1                                     | id of first plant               |
| **plant2**        | 2                                     | id of second plant              |
| **relation**      | neutral                               | type of relation                |
| **note**          | why put two cherries together anyways | some comment about the relation |

## `Maps`

| **_Column name_**   | **_Example_** | **_Description_**                                                                              |
| :------------------ | :------------ | :--------------------------------------------------------------------------------------------- |
| **id**              | 1             |
| **created_by**      | 1             |
| **name**            | My Map        | only alphanumerical values                                                                     |
| **is_inactive**     | false         |
| **last_visit**      | 2023-04-04    |
| **honors**          | 0             | 0 to infinity                                                                                  |
| **visits**          | 0             | 0 to infinity                                                                                  |
| **harvested**       | 0             | 0 to infinity, amount of plants harvested on this map                                          |
| **version_date**    | 2023-04-04    | the date the snapshot for this version was taken                                               |
| **created_at**      | 2023-04-04    |
| **deletion_date**   | 2023-04-04    |
| **inactivity_date** | 2023-04-04    |
| **zoom_factor**     | 100           | value used in formula "X by X cm", e.g. 100 would mean "100 x 100 cm", range from 10 to 100000 |
| **geo_data**        | NULL          | PostGis Geodata, location of the map                                                           |

## `Layers`

| **_Column name_**  | **_Example_**        | **_Description_**                                      |
| :----------------- | :------------------- | :----------------------------------------------------- |
| **id**             | 1                    |
| **map_id**         | 1                    | the id of the map                                      |
| **type**           | {base, plants, etc.} | the type of layer                                      |
| **name**           | Base Layer           | the display name of the layer                          |
| **is_alternative** | false                | true if the layer is an user-created alternative layer |

## `Plantings`

| **_Column name_** | **_Example_** | **_Description_**                            |
| :---------------- | :------------ | :------------------------------------------- |
| **id**            | 1             |                                              |
| **layer_id**      | 1             | the id of the layer                          |
| **plant_id**      | 1             | the plant that is planted                    |
| **x**             | 1             | the x coordinate of the position on the map. |
| **y**             | 1             | the y coordinate of the position on the map. |
| **width**         | 1             | the width of the plant on the map.           |
| **height**        | 1             | the height of the plant on the map.          |
| **rotation**      | 0             | the rotation of the plant on the map.        |
| **scale_x**       | 1             | the x scale of the plant on the map.         |
| **scale_y**       | 1             | the y scale of the plant on the map.         |

## `Users`

| **_Column name_** | **_Example_**                        | **_Description_**                    |
| :---------------- | :----------------------------------- | :----------------------------------- |
| **id**            | 00000000-0000-0000-0000-000000000000 | the UUID from Keycloak               |
| **salutation**    | Mr                                   | the preferred salutation of the user |
| **title**         | NULL                                 | the title of the user                |
| **country**       | Austria                              | the country of the user              |
| **phone**         | NULL                                 | the phone number of the user         |
| **website**       | NULL                                 | the website of the user              |
| **organization**  | NULL                                 | the organization of the user         |
| **experience**    | beginner                             | the experience level of the user     |
| **membership**    | Regular Membership                   | the membership type of the user      |
| **member_years**  | {2023}                               | array of years                       |
| **member_since**  | 2023-07-12                           | since when the user is a member      |
| **permacoins**    | {0}                                  | array of positive integers           |

## `Guided Tours`

| **_Column name_** | **_Example_**                        | **_Description_**            |
| :---------------- | :----------------------------------- | :--------------------------- |
| **user**          | 00000000-0000-0000-0000-000000000000 | the id of the user           |
| **editor_tour**   | false                                | flag for the Map Editor Tour |

## `Blossoms`

| **_Column name_** | **_Example_**          | **_Description_**                            |
| :---------------- | :--------------------- | :------------------------------------------- |
| **title**         | Novice Gardener        |
| **description**   | Plant your first plant |
| **track**         | Beginners Track        | the track (category) this blossom belongs to |
| **icon**          | NULL                   |
| **is_seasonal**   | false                  | resets and repeats every year                |

## `Blossoms Gained`

| **_Column name_** | **_Example_** | **_Description_**               |
| :---------------- | :------------ | :------------------------------ |
| **id**            | 1             |
| **user_id**       | 1             |
| **blossom_id**    | 1             |
| **times_gained**  | 1             | 0 to infinity                   |
| **gained_date**   | {2023-04-10}  | one entry for every time gained |

## `IngredientLists`

| **_Column name_** | **_Example_**                          | **_Description_**                                                              |
| :---------------- | :------------------------------------- | :----------------------------------------------------------------------------- |
| **id**            | 1                                      | list id                                                                        |
| **created_by**    | 1                                      | user id                                                                        |
| **map_id**        | 1                                      | id of the map this list is for                                                 |
| **name**          | Smoothie Ingredients                   | name of the list                                                               |
| **description**   | Ingredients for my strawberry smoothie | description of the list                                                        |
| **image**         | NULL                                   | an image for further customizing the list                                      |
| **is_recurring**  | true                                   | a flag representing whether the objectives repeat themselves or not            |
| **end_date**      | 2023-04-15                             | an optional date at which point the owner wants the objectives to be fulfilled |
| **accomplished**  | 0                                      | the number of times the list was fulfilled; only relevant for recurring lists  |

## `Ingredients`

Many-to-many table to store relations between plants and ingredient lists.

| **_Column name_** | **_Example_** | **_Description_**                             |
| :---------------- | :------------ | :-------------------------------------------- |
| **list_id**       | 1             | id of the ingredient list                     |
| **plant_id**      | 1             | id of the plant used as an ingredient         |
| **is_fulfilled**  | true          | if enough of this ingredient can be harvested |

## `Events`

| **_Column name_** | **_Example_**        | **_Description_**                                                  |
| :---------------- | :------------------- | :----------------------------------------------------------------- |
| **id**            | 1                    | event id                                                           |
| **map_id**        | 1                    | id of the map the event is taking place on                         |
| **system_event**  | true                 | a flag representing whether this event is system or user generated |
| **name**          | Harvest strawberries | name of the event                                                  |
| **description**   | NULL                 | description of the event details                                   |
| **event_date**    | 2023-04-15           | the date the event is taking place on                              |

## `Favorites`

Many-to-many table to store map-specific favourites.

| **_Column name_** | **_Example_** | **_Description_** |
| :---------------- | :------------ | :---------------- |
| **map_id**        | 1             | id of the map     |
| **plant_id**      | 1             | id of the plant   |

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
