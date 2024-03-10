//! [`HerbaceousOrWoody`] enum.

use diesel_derive_enum::DbEnum;
use serde::{Deserialize, Serialize};
use typeshare::typeshare;
use utoipa::ToSchema;

#[allow(clippy::missing_docs_in_private_items)] // TODO: See #97.
#[typeshare]
#[derive(Serialize, Deserialize, DbEnum, Debug, ToSchema)]
#[ExistingTypePath = "crate::schema::sql_types::HerbaceousOrWoody"]
pub enum HerbaceousOrWoody {
    #[serde(rename = "herbaceous")]
    #[db_rename = "herbaceous"]
    Herbaceous,

    #[serde(rename = "woody")]
    #[db_rename = "woody"]
    Woody,
}
