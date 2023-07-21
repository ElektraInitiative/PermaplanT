//! [`PrivacyOption`] enum.

use diesel_derive_enum::DbEnum;
use serde::{Deserialize, Serialize};
use typeshare::typeshare;
use utoipa::ToSchema;

/// Enum for map privacy setting options.
#[typeshare]
#[derive(Serialize, Deserialize, DbEnum, Debug, ToSchema, Clone)]
#[ExistingTypePath = "crate::schema::sql_types::PrivacyOption"]
pub enum PrivacyOption {
    /// Data is private and only visible for owner or members, the data was explicitly shared with.
    #[serde(rename = "private")]
    #[db_rename = "private"]
    Private,

    /// Data is protected and only visible for other members.
    #[serde(rename = "protected")]
    #[db_rename = "protected"]
    Protected,

    /// Data is public and visible for everyone.
    #[serde(rename = "public")]
    #[db_rename = "public"]
    Public,
}
