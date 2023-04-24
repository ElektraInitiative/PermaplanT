//! [`PropagationMethod`] enum.

use diesel_derive_enum::DbEnum;
use serde::{Deserialize, Serialize};
use typeshare::typeshare;
use utoipa::ToSchema;

#[allow(clippy::missing_docs_in_private_items)]
#[typeshare]
#[derive(Serialize, Deserialize, DbEnum, Debug, ToSchema)]
#[ExistingTypePath = "crate::schema::sql_types::PropagationMethod"]
pub enum PropagationMethod {
    #[serde(rename = "seed - direct sow")]
    #[db_rename = "seed - direct sow"]
    SeedDirectSow,

    #[serde(rename = "seed - transplant")]
    #[db_rename = "seed - transplant"]
    SeedTransplant,

    #[serde(rename = "division")]
    Division,

    #[serde(rename = "cuttings")]
    Cuttings,

    #[serde(rename = "layering")]
    Layering,

    #[serde(rename = "spores")]
    Spores,

    #[serde(rename = "seed")]
    Seed,
}
