//! [`Quality`] enum.

use diesel_derive_enum::DbEnum;
use serde::{Deserialize, Serialize};
use typeshare::typeshare;
use utoipa::ToSchema;

#[allow(clippy::missing_docs_in_private_items)] // TODO: See #97.
#[typeshare]
#[derive(Serialize, Deserialize, DbEnum, Debug, ToSchema)]
#[ExistingTypePath = "crate::schema::sql_types::Quality"]
pub enum Quality {
    #[serde(rename = "organic")]
    #[db_rename = "organic"]
    Organic,
    #[serde(rename = "not organic")]
    #[db_rename = "not organic"]
    NotOrganic,
    #[db_rename = "unknown"]
    #[serde(rename = "unknown")]
    Unknown,
}
