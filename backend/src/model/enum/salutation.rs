//! [`Salutation`] enum.

use diesel_derive_enum::DbEnum;
use serde::{Deserialize, Serialize};
use typeshare::typeshare;
use utoipa::ToSchema;

/// Enum for all possible salutations.
#[typeshare]
#[derive(Serialize, Deserialize, DbEnum, Debug, ToSchema)]
#[ExistingTypePath = "crate::schema::sql_types::Salutation"]
pub enum Salutation {
    /// female neutral salutation.
    #[serde(rename = "Ms")]
    #[db_rename = "Ms"]
    Ms,
    /// female married salutation.
    #[serde(rename = "Mrs")]
    #[db_rename = "Mrs"]
    Mrs,
    /// male salutation.
    #[serde(rename = "Mr")]
    #[db_rename = "Mr"]
    Mr,
}
