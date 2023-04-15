//! Light requirement for a plant.

use diesel_derive_enum::DbEnum;
use serde::{Deserialize, Serialize};
use typeshare::typeshare;
use utoipa::ToSchema;

#[allow(clippy::missing_docs_in_private_items)] // TODO: See #97.
#[typeshare]
#[derive(Serialize, Deserialize, DbEnum, Debug, ToSchema)]
#[ExistingTypePath = "crate::schema::sql_types::LightRequirement"]
pub enum LightRequirement {
    #[serde(rename = "Full shade")]
    #[db_rename = "Full shade"]
    FullShade,

    #[serde(rename = "Partial sun/shade")]
    #[db_rename = "Partial sun/shade"]
    Partial,

    #[serde(rename = "Full sun")]
    #[db_rename = "Full sun"]
    Full,
}
