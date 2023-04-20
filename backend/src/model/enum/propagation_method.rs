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
    #[serde(rename = "Seed - direct sow")]
    #[db_rename = "Seed - direct sow"]
    SeedDirectSow,

    #[serde(rename = "Seed - transplant")]
    #[db_rename = "Seed - transplant"]
    SeedTransplant,

    #[serde(rename = "Division")]
    Division,

    #[serde(rename = "Cuttings")]
    Cuttings,

    #[serde(rename = "Layering")]
    Layering,

    #[serde(rename = "Spores")]
    Spores,

    #[serde(rename = "Seed")]
    Seed,
}
