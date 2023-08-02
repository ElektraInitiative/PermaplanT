//! [`Track`] enum.

use diesel_derive_enum::DbEnum;
use serde::{Deserialize, Serialize};
use typeshare::typeshare;
use utoipa::ToSchema;

/// Enum containing all possible Blossom tracks.
#[typeshare]
#[derive(Serialize, Deserialize, DbEnum, Debug, ToSchema)]
#[ExistingTypePath = "crate::schema::sql_types::Track"]
pub enum Track {
    /// Track for Blossoms aimed at new users.
    #[serde(rename = "beginner")]
    #[db_rename = "beginner"]
    Beginner,
    /// Track for Blossoms aimed to be repeated every season.
    #[serde(rename = "seasonal")]
    #[db_rename = "seasonal"]
    Seasonal,
    /// Track for Blossoms aimed at users that want to do everything PermaplanT has to offer.
    #[serde(rename = "completionist")]
    #[db_rename = "completionist"]
    Completionist,
    /// Track for Blossoms aimed at user that want to prove their expertise by helping others.
    #[serde(rename = "expert")]
    #[db_rename = "expert"]
    Expert,
}
