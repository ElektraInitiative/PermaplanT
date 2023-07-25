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
    #[serde(rename = "ms")]
    #[db_rename = "ms"]
    Ms,
    /// female married salutation.
    #[serde(rename = "mrs")]
    #[db_rename = "mrs"]
    Mrs,
    /// male salutation.
    #[serde(rename = "mr")]
    #[db_rename = "mr"]
    Mr,
    /// gender neutral salutation.
    #[serde(rename = "mx")]
    #[db_rename = "mx"]
    Mx,
}
