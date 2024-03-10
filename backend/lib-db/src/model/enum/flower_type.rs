//! [`FlowerType`] enum.

use diesel_derive_enum::DbEnum;
use serde::{Deserialize, Serialize};
use typeshare::typeshare;
use utoipa::ToSchema;

#[allow(clippy::missing_docs_in_private_items)] // TODO: See #97.
#[typeshare]
#[derive(Serialize, Deserialize, DbEnum, Debug, ToSchema)]
#[ExistingTypePath = "crate::schema::sql_types::FlowerType"]
pub enum FlowerType {
    #[serde(rename = "dioecious")]
    #[db_rename = "dioecious"]
    Dioecious,

    #[serde(rename = "monoecious")]
    #[db_rename = "monoecious"]
    Monoecious,

    #[serde(rename = "hermaphrodite")]
    #[db_rename = "hermaphrodite"]
    Hermaphrodite,
}
