//! [`Shade`] enum.

use diesel_derive_enum::DbEnum;
use serde::{Deserialize, Serialize};
use typeshare::typeshare;
use utoipa::ToSchema;

#[allow(clippy::missing_docs_in_private_items)] // TODO: See #97.
#[typeshare]
#[derive(Serialize, Deserialize, DbEnum, Debug, ToSchema)]
#[DieselTypePath = "crate::schema::sql_types::Shade"]
pub enum Shade {
    #[serde(rename = "no shade")]
    #[db_rename = "no shade"]
    No,

    #[serde(rename = "light shade")]
    #[db_rename = "light shade"]
    Light,

    #[serde(rename = "partial shade")]
    #[db_rename = "partial shade"]
    Partial,


    #[serde(rename = "permanent shade")]
    #[db_rename = "permanent shade"]
    Permanent,


    #[serde(rename = "permanent deep shade")]
    #[db_rename = "permanent deep shade"]
    PermanentDeep,

}
