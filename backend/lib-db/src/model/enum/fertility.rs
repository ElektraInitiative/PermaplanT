//! [`Fertility`] enum.

use diesel_derive_enum::DbEnum;
use serde::{Deserialize, Serialize};
use typeshare::typeshare;
use utoipa::ToSchema;

#[allow(clippy::missing_docs_in_private_items)] // TODO: See #97.
#[typeshare]
#[derive(Serialize, Deserialize, DbEnum, Debug, ToSchema)]
#[ExistingTypePath = "crate::schema::sql_types::Fertility"]
pub enum Fertility {
    #[serde(rename = "self fertile")]
    #[db_rename = "self fertile"]
    SelfFertile,

    #[serde(rename = "self sterile")]
    #[db_rename = "self sterile"]
    SelfSterile,
}
