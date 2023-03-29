use diesel::sql_types::*;
use serde::{Deserialize, Serialize};

#[derive(DbEnum, Debug, Serialize, Deserialize, ToSchema)]
pub enum Water {
    Low,
    Moderate,
    High,
    Aquatic,
}

#[derive(DbEnum, Debug, Serialize, Deserialize, ToSchema)]
pub enum Sun {
    IndirectSun,
    PartialSun,
    FullSun,
}

#[derive(DbEnum, Debug, Serialize, Deserialize, ToSchema)]
pub enum Shade {
    NoShade,
    LightShade,
    PartialShade,
    PermanentShade,
    PermanentDeepShade,
}

#[derive(DbEnum, Debug, Serialize, Deserialize, ToSchema)]
pub enum SoilPh {
    VeryAcid,
    Acid,
    Neutral,
    Alkaline,
    VeryAlkaline,
}

#[derive(DbEnum, Debug, Serialize, Deserialize, ToSchema)]
pub enum SoilTexture {
    Sandy,
    Loamy,
    Clay,
    HeavyClay,
}

#[derive(DbEnum, Debug, Serialize, Deserialize, ToSchema)]
pub enum SoilWaterRetention {
    WellDrained,
    Moist,
    Wet,
}

#[derive(DbEnum, Debug, Serialize, Deserialize, ToSchema)]
pub enum LifeCycle {
    Annual,
    Biennial,
    Perennial,
}

#[derive(DbEnum, Debug, Serialize, Deserialize, ToSchema)]
pub enum GrowthRate {
    Slow,
    Moderate,
    Vigorous,
}

#[derive(DbEnum, Debug, Serialize, Deserialize, ToSchema)]
pub enum FlowerType {
    Dioecious,
    Monoecious,
    Hermaphrodite,
}

#[derive(DbEnum, Debug, Serialize, Deserialize, ToSchema)]
pub enum Fertility {
    SelfFertile,
    SelfSterile,
}

#[derive(DbEnum, Debug, Serialize, Deserialize, ToSchema)]
pub enum HerbaceousOrWoody {
    Herbaceous,
    Woody,
}

#[derive(DbEnum, Debug, Serialize, Deserialize, ToSchema)]
pub enum DeciduousOrEvergreen {
    Deciduous,
    Evergreen,
}

#[derive(DbEnum, Debug, Serialize, Deserialize, ToSchema)]
pub enum RootZoneTendancy {
    Surface,
    Shallow,
    Deep,
}

#[derive(DbEnum, Debug, Serialize, Deserialize, ToSchema)]
pub enum NutritionDemand {
    LightFeeder,
    ModerateFeeder,
    HeavyFeeder,
}
