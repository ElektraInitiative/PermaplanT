//! [`Experience`] enum.

use diesel_derive_enum::DbEnum;
use serde::{Deserialize, Serialize};
use typeshare::typeshare;
use utoipa::ToSchema;

/// Enum for all possible experience levels.
#[typeshare]
#[derive(Serialize, Deserialize, DbEnum, Debug, ToSchema)]
#[ExistingTypePath = "crate::schema::sql_types::Experience"]
pub enum Experience {
    /// Beginner in permaculture.
    #[serde(rename = "beginner")]
    #[db_rename = "beginner"]
    Beginner,
    /// Advanced in permaculture.
    #[serde(rename = "advanced")]
    #[db_rename = "advanced"]
    Advanced,
    /// Expert in permaculture.
    #[serde(rename = "expert")]
    #[db_rename = "expert"]
    Expert,
}
