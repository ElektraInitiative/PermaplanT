//! External source enum.

use diesel_derive_enum::DbEnum;
use serde::{Deserialize, Serialize};
use typeshare::typeshare;
use utoipa::ToSchema;

#[allow(clippy::missing_docs_in_private_items)]
#[typeshare]
#[derive(Serialize, Deserialize, DbEnum, Debug, ToSchema)]
#[ExistingTypePath = "crate::schema::sql_types::ExternalSource"]
pub enum ExternalSource {
    #[serde(rename = "practicalplants")]
    #[db_rename = "practicalplants"]
    PracticalPlants,

    #[serde(rename = "permapeople")]
    #[db_rename = "permapeople"]
    PermaPeople,

    #[serde(rename = "reinsaat")]
    #[db_rename = "reinsaat"]
    Reinsaat,
}
