//! [`Sun`] enum.

use diesel_derive_enum::DbEnum;
use serde::{Deserialize, Serialize};
use typeshare::typeshare;
use utoipa::ToSchema;

#[allow(clippy::missing_docs_in_private_items)] // TODO: See #97.
#[typeshare]
#[derive(Serialize, Deserialize, DbEnum, Debug, ToSchema)]
#[DieselTypePath = "crate::schema::sql_types::Sun"]
pub enum Sun {
    #[serde(rename = "indirect sun")]
    #[db_rename = "indirect sun"]
    Indirect,

    #[serde(rename = "partial sun")]
    #[db_rename = "partial sun"]
    Partial,

    #[serde(rename = "full sun")]
    #[db_rename = "full sun"]
    Full,

}
