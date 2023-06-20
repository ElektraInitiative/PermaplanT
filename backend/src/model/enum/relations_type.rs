//! [`RelationsType`] enum.

use diesel_derive_enum::DbEnum;
use serde::{Deserialize, Serialize};
use typeshare::typeshare;
use utoipa::ToSchema;

/// Specifies the type of relation between two plants.
#[typeshare]
#[derive(Debug, Clone, Serialize, Deserialize, DbEnum, ToSchema)]
#[ExistingTypePath = "crate::schema::sql_types::RelationsType"]
pub enum RelationsType {
    /// If a plant works well with another plant.
    #[serde(rename = "companion")]
    #[db_rename = "companion"]
    Companion,

    /// If there is nothing particular to say about the plants relation.
    #[serde(rename = "neutral")]
    #[db_rename = "neutral"]
    Neutral,

    /// If a plant doesn't work well with another plant.
    #[serde(rename = "antagonist")]
    #[db_rename = "antagonist"]
    Antagonist,
}
