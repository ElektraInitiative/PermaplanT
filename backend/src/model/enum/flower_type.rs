//! [`FlowerType`] enum.

use diesel_derive_enum::DbEnum;
use serde::{Deserialize, Serialize};
use typeshare::typeshare;
use utoipa::ToSchema;

#[allow(clippy::missing_docs_in_private_items)] // TODO: See #97.
#[typeshare]
#[derive(Serialize, Deserialize, DbEnum, Debug, ToSchema)]
#[DieselTypePath = "crate::schema::sql_types::FlowerType"]
pub enum FlowerType {
    #[serde(rename = "diocious")]
    #[db_rename = "diocious"]
    Diocious,

    #[serde(rename = "monocious")]
    #[db_rename = "monocious"]
    Monocious,

    #[serde(rename = "hermaphrodite")]
    #[db_rename = "hermaphrodite"]
    Hermaphrodite,
}
