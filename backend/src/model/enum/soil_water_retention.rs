//! [`SoilWaterRetention`] enum.

use diesel_derive_enum::DbEnum;
use serde::{Deserialize, Serialize};
use typeshare::typeshare;
use utoipa::ToSchema;

#[allow(clippy::missing_docs_in_private_items)] // TODO: See #97.
#[typeshare]
#[derive(Serialize, Deserialize, DbEnum, Debug, ToSchema)]
#[ExistingTypePath = "crate::schema::sql_types::SoilWaterRetention"]
pub enum SoilWaterRetention {
    #[serde(rename = "well drained")]
    #[db_rename = "well drained"]
    WellDrained,

    #[serde(rename = "moist")]
    #[db_rename = "moist"]
    Moist,

    #[serde(rename = "wet")]
    #[db_rename = "wet"]
    Wet,
}
