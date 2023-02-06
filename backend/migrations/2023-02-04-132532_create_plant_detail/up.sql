-- Your SQL goes here
CREATE TYPE WATER AS ENUM ('low', 'moderate', 'high', 'aquatic');
CREATE TYPE SUN AS ENUM ('indirect sun', 'partial sun', 'full sun');
CREATE TYPE SHADE AS ENUM (
  'no shade',
  'light shade',
  'partial shade',
  'permanent shade',
  'permanent deep shade'
);
CREATE TYPE SOIL_PH AS ENUM (
  'very acid',
  'acid',
  'neutral',
  'alkaline',
  'very alkaline'
);
CREATE TYPE SOIL_TEXTURE AS ENUM ('sandy', 'loamy', 'clay', 'heavy clay');
CREATE TYPE SOIL_WATER_RETENTION AS ENUM ('moist', 'wet', 'well drained');
CREATE TYPE LIFE_CYCLE AS ENUM ('annual', 'biennial', 'perennial');
CREATE TYPE GROWTH_RATE AS ENUM ('slow', 'moderate', 'vigorous');
CREATE TYPE FLOWER_TYPE AS ENUM ('dioecious', 'monoecious', 'hermaphrodite');
CREATE TYPE FERTILITY AS ENUM ('self fertile', 'self sterile');
CREATE TYPE HERBACEOUS_OR_WOODY AS ENUM ('herbaceous', 'woody');
CREATE TABLE plant_detail (
  id SERIAL PRIMARY KEY,
  binomial_name VARCHAR NOT NULL,
  common_name VARCHAR,
  folder_name VARCHAR,
  synonyms VARCHAR,
  genus VARCHAR,
  family VARCHAR,
  edible_uses VARCHAR,
  medicinal_uses VARCHAR,
  material_uses_and_functions VARCHAR,
  botanic VARCHAR,
  propagation VARCHAR,
  cultivation VARCHAR,
  environment VARCHAR,
  material_uses VARCHAR,
  functions VARCHAR,
  provides_forage_for VARCHAR,
  provides_shelter_for VARCHAR,
  hardiness_zone SMALLINT,
  heat_zone VARCHAR,
  water WATER,
  sun SUN,
  shade VARCHAR,
  soil_ph SOIL_PH ARRAY,
  soil_texture SOIL_TEXTURE ARRAY,
  soil_water_retention SOIL_WATER_RETENTION ARRAY,
  environmental_tolerances VARCHAR,
  native_climate_zones VARCHAR,
  adapted_climate_zones VARCHAR,
  native_geographical_range VARCHAR,
  native_environment VARCHAR,
  ecosystem_niche VARCHAR,
  root_zone_tendancy VARCHAR,
  deciduous_or_evergreen VARCHAR,
  herbaceous_or_woody HERBACEOUS_OR_WOODY,
  life_cycle LIFE_CYCLE ARRAY,
  growth_rate GROWTH_RATE,
  mature_size VARCHAR,
  fertility FERTILITY ARRAY,
  pollinators VARCHAR,
  flower_colour VARCHAR,
  flower_type FLOWER_TYPE,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
  CONSTRAINT plant_detail_binomial_name_key UNIQUE (binomial_name),
  CHECK (
    hardiness_zone IS NULL
    OR (
      hardiness_zone >= 0
      AND hardiness_zone <= 13
    )
  )
);