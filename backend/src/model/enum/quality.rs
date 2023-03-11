//! [`Quality`] enum.

use diesel_derive_enum::DbEnum;
use serde::{Deserialize, Serialize};
use typeshare::typeshare;

#[allow(clippy::missing_docs_in_private_items)] // TODO: See #97.
#[typeshare]
#[derive(Serialize, Deserialize, DbEnum, Debug)]
#[DieselTypePath = "crate::schema::sql_types::Quality"]
pub enum Quality {
    #[serde(rename = "Organic")]
    #[db_rename = "Organic"]
    Organic,
    #[serde(rename = "Not organic")]
    #[db_rename = "Not organic"]
    NotOrganic,
    #[db_rename = "Unknown"]
    #[serde(rename = "Unknown")]
    Unknown,
}
