//! [`Membership`] enum.

use diesel_derive_enum::DbEnum;
use serde::{Deserialize, Serialize};
use typeshare::typeshare;
use utoipa::ToSchema;

/// Enum containing all possible membership types.
#[typeshare]
#[derive(Serialize, Deserialize, DbEnum, Debug, ToSchema)]
#[ExistingTypePath = "crate::schema::sql_types::Membership"]
pub enum Membership {
    /// Membership type for supporting PermaplanT financially.
    #[serde(rename = "supporting")]
    #[db_rename = "supporting"]
    Supporting,
    /// Membership type for regular PermaplanT membership.
    #[serde(rename = "regular")]
    #[db_rename = "regular"]
    Regular,
    /// Membership type for enjoying PermaplanT by helping others.
    #[serde(rename = "contributing")]
    #[db_rename = "contributing"]
    Contributing,
}
