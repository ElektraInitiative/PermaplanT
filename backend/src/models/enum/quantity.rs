use diesel_derive_enum::DbEnum;
use serde::{Deserialize, Serialize};
use typeshare::typeshare;

#[typeshare]
#[derive(Serialize, Deserialize, DbEnum, Debug)]
#[DieselTypePath = "crate::schema::sql_types::Quantity"]
pub enum Quantity {
    #[serde(rename = "Nothing")]
    #[db_rename = "Nothing"]
    Nothing,
    #[serde(rename = "Not enough")]
    #[db_rename = "Not enough"]
    NotEnough,
    #[serde(rename = "Enough")]
    #[db_rename = "Enough"]
    Enough,
    #[serde(rename = "More than enough")]
    #[db_rename = "More than enough"]
    MoreThanEnough,
}
