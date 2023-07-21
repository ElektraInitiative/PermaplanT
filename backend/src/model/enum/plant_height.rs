//! [`PlantHeight`] enum.

use diesel_derive_enum::DbEnum;
use serde::{Deserialize, Serialize};
use typeshare::typeshare;
use utoipa::ToSchema;

#[allow(clippy::missing_docs_in_private_items)] // TODO: See #97.
#[typeshare]
#[derive(Serialize, Deserialize, DbEnum, Debug, ToSchema)]
#[ExistingTypePath = "crate::schema::sql_types::PlantHeight"]
pub enum PlantHeight {
    #[serde(rename = "low")]
    #[db_rename = "low"]
    Low,

    #[serde(rename = "medium")]
    #[db_rename = "medium"]
    Medium,

    #[serde(rename = "high")]
    #[db_rename = "high"]
    High,

    #[serde(rename = "na")]
    #[db_rename = "na"]
    Na,
}
