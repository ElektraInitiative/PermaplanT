//! [`PlantSpread`] enum.

use diesel_derive_enum::DbEnum;
use serde::{Deserialize, Serialize};
use typeshare::typeshare;
use utoipa::ToSchema;

#[allow(clippy::missing_docs_in_private_items)] // TODO: See #97.
#[typeshare]
#[derive(Serialize, Deserialize, DbEnum, Debug, ToSchema, Eq, PartialEq)]
#[ExistingTypePath = "crate::schema::sql_types::PlantSpread"]
pub enum PlantSpread {
    #[serde(rename = "narrow")]
    #[db_rename = "narrow"]
    Narrow,

    #[serde(rename = "medium")]
    #[db_rename = "medium"]
    Medium,

    #[serde(rename = "wide")]
    #[db_rename = "wide"]
    Wide,

    #[serde(rename = "na")]
    #[db_rename = "na"]
    Na,
}
