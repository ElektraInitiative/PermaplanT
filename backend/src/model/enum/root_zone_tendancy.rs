//! [`RootZoneTendancy`] enum.

use diesel_derive_enum::DbEnum;
use serde::{Deserialize, Serialize};
use typeshare::typeshare;
use utoipa::ToSchema;

#[allow(clippy::missing_docs_in_private_items)] // TODO: See #97.
#[typeshare]
#[derive(Serialize, Deserialize, DbEnum, Debug, ToSchema)]
#[DieselTypePath = "crate::schema::sql_types::RootZoneTendancy"]
pub enum RootZoneTendancy {
    #[serde(rename = "surface")]
    #[db_rename = "surface"]
    Surface,

    #[serde(rename = "shallow")]
    #[db_rename = "shallow"]
    Shallow,

    #[serde(rename = "deep")]
    #[db_rename = "deep"]
    Deep,
}
