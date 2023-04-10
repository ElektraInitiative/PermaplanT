//! [`SoilPh`] enum.

use diesel_derive_enum::DbEnum;
use serde::{Deserialize, Serialize};
use typeshare::typeshare;
use utoipa::ToSchema;

#[allow(clippy::missing_docs_in_private_items)] // TODO: See #97.
#[typeshare]
#[derive(Serialize, Deserialize, DbEnum, Debug, ToSchema)]
#[ExistingTypePath = "crate::schema::sql_types::SoilPh"]
pub enum SoilPh {
    #[serde(rename = "very acid")]
    #[db_rename = "very acid"]
    VeryAcidic,

    #[serde(rename = "acid")]
    #[db_rename = "acid"]
    Acidic,

    #[serde(rename = "neutral")]
    #[db_rename = "neutral"]
    Neutral,

    #[serde(rename = "alkaline")]
    #[db_rename = "alkaline"]
    Alkaline,

    #[serde(rename = "very alkaline")]
    #[db_rename = "very alkaline"]
    VeryAlkaline,
}
