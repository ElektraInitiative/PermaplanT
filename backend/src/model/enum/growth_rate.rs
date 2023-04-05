//! [`GrowthRate`] enum.

use diesel_derive_enum::DbEnum;
use serde::{Deserialize, Serialize};
use typeshare::typeshare;
use utoipa::ToSchema;

#[allow(clippy::missing_docs_in_private_items)] // TODO: See #97.
#[typeshare]
#[derive(Serialize, Deserialize, DbEnum, Debug, ToSchema)]
#[ExistingTypePath = "crate::schema::sql_types::GrowthRate"]
pub enum GrowthRate {
    #[serde(rename = "slow")]
    #[db_rename = "slow"]
    Slow,

    #[serde(rename = "moderate")]
    #[db_rename = "moderate"]
    Moderate,

    #[serde(rename = "vigorous")]
    #[db_rename = "vigorous"]
    Vigorous,
}
