//! [`LifeCycle`] enum.

use diesel_derive_enum::DbEnum;
use serde::{Deserialize, Serialize};
use typeshare::typeshare;
use utoipa::ToSchema;

#[allow(clippy::missing_docs_in_private_items)] // TODO: See #97.
#[typeshare]
#[derive(Serialize, Deserialize, DbEnum, Debug, ToSchema)]
#[ExistingTypePath = "crate::schema::sql_types::LifeCycle"]
pub enum LifeCycle {
    #[serde(rename = "annual")]
    #[db_rename = "annual"]
    Annual,

    #[serde(rename = "biennial")]
    #[db_rename = "biennial"]
    Biennial,

    #[serde(rename = "perennial")]
    #[db_rename = "perennial"]
    Perennial,
}
