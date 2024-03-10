//! [`Quantity`] enum.

use diesel_derive_enum::DbEnum;
use serde::{Deserialize, Serialize};
use typeshare::typeshare;
use utoipa::ToSchema;

#[allow(clippy::missing_docs_in_private_items)] // TODO: See #97.
#[typeshare]
#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize, DbEnum, ToSchema)]
#[ExistingTypePath = "crate::schema::sql_types::Quantity"]
pub enum Quantity {
    #[serde(rename = "nothing")]
    #[db_rename = "nothing"]
    Nothing,
    #[serde(rename = "not enough")]
    #[db_rename = "not enough"]
    NotEnough,
    #[serde(rename = "enough")]
    #[db_rename = "enough"]
    Enough,
    #[serde(rename = "more than enough")]
    #[db_rename = "more than enough"]
    MoreThanEnough,
}
