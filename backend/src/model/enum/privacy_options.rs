//! [`PrivacyOptions`] enum.

use diesel_derive_enum::DbEnum;
use serde::{Deserialize, Serialize};
use typeshare::typeshare;
use utoipa::ToSchema;

/// Enum for map privacy setting options.
#[typeshare]
#[derive(Serialize, Deserialize, DbEnum, Debug, ToSchema)]
#[ExistingTypePath = "crate::schema::sql_types::PrivacyOptions"]
pub enum PrivacyOptions {
    /// Map is private and only visible for owner.
    #[serde(rename = "private")]
    #[db_rename = "private"]
    Private,

    /// Map is protected and only visible for members.
    #[serde(rename = "protected")]
    #[db_rename = "protected"]
    Protected,

    /// Map is public and visible for everyone.
    #[serde(rename = "public")]
    #[db_rename = "public"]
    Public,
}
