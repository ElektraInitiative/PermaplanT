//! [`RelationsType`] enum.

use diesel_derive_enum::DbEnum;
use serde::Serialize;
use typeshare::typeshare;
use utoipa::ToSchema;

#[typeshare]
#[derive(Serialize, DbEnum, Debug, ToSchema)]
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
