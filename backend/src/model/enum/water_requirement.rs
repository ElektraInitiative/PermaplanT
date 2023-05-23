//! Water requirement of a plant.

use diesel_derive_enum::DbEnum;
use serde::{Deserialize, Serialize};
use typeshare::typeshare;
use utoipa::ToSchema;

/// *Used* in hydrology layer.
/// *Fetched from* PracticalPlants and Permapeople (merged with `water` of PracticalPlants).
#[typeshare]
#[derive(Serialize, Deserialize, DbEnum, Debug, ToSchema)]
#[ExistingTypePath = "crate::schema::sql_types::WaterRequirement"]
pub enum WaterRequirement {
    /// well drained, little water input
    #[serde(rename = "dry")]
    #[db_rename = "dry"]
    Dry,

    /// regular water supply, e.g. flat bed with humus
    #[serde(rename = "moist")]
    #[db_rename = "moist"]
    Moist,

    /// drowned, (often) flooded or in general very moist, e.g. swamp
    #[serde(rename = "wet")]
    #[db_rename = "wet"]
    Wet,

    /// completely aquatic
    #[serde(rename = "water")]
    #[db_rename = "water"]
    Water,
}
