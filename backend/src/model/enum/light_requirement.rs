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
    #[serde(rename = "full shade")]
    #[db_rename = "full shade"]
    FullShade,

    #[serde(rename = "partial sun/shade")]
    #[db_rename = "partial sun/shade"]
    Partial,

    #[serde(rename = "full sun")]
    #[db_rename = "full sun"]
    Full,
}
