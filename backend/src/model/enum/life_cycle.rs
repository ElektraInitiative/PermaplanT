//! [`LifeCycle`] enum.

use diesel_derive_enum::DbEnum;
use serde::{Deserialize, Serialize};
use typeshare::typeshare;
use utoipa::ToSchema;

#[allow(clippy::missing_docs_in_private_items)] // TODO: See #97.
#[typeshare]
#[derive(Serialize, Deserialize, DbEnum, Debug, PartialEq, Eq, ToSchema, Clone, Copy)]
#[ExistingTypePath = "crate::schema::sql_types::LifeCycle"]
pub enum LifeCycle {
    #[serde(rename = "annual")]
    #[db_rename = "annual"]
    /// on the map for current year
    Annual,

    #[serde(rename = "biennial")]
    #[db_rename = "biennial"]
    /// on the map for current and next year
    Biennial,

    #[serde(rename = "perennial")]
    #[db_rename = "perennial"]
    /// on the map until removed by user
    Perennial,
}
