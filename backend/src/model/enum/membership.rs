/// [`Membership`] enum.
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
    #[serde(rename = "Supporting Member")]
    #[db_rename = "Supporting Member"]
    SupportingMember,
    /// Membership type for regular PermaplanT membership.
    #[serde(rename = "Regular Member")]
    #[db_rename = "Regular Member"]
    RegularMember,
    /// Membership type for enjoying PermaplanT by helping others.
    #[serde(rename = "Contributing Member")]
    #[db_rename = "Contributing Member"]
    ContributingMember,
}
