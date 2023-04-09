//! [`DeciduousOrEvergreen`] enum.

use diesel_derive_enum::DbEnum;
use serde::{Deserialize, Serialize};
use typeshare::typeshare;
use utoipa::ToSchema;

#[allow(clippy::missing_docs_in_private_items)] // TODO: See #97.
#[typeshare]
#[derive(Serialize, Deserialize, DbEnum, Debug, ToSchema)]
#[ExistingTypePath = "crate::schema::sql_types::DeciduousOrEvergreen"]
pub enum DeciduousOrEvergreen {
    #[serde(rename = "deciduous")]
    #[db_rename = "deciduous"]
    Deciduous,

    #[serde(rename = "evergreen")]
    #[db_rename = "evergreen"]
    Evergreen,
}
