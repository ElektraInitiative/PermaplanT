use diesel_derive_enum::DbEnum;
use serde::{Deserialize, Serialize};
use typeshare::typeshare;

#[typeshare]
#[derive(Serialize, Deserialize, Debug, DbEnum)]
#[DieselTypePath = "crate::schema::sql_types::Tag"]
pub enum Tag {
    #[serde(rename = "Leaf crops")]
    #[db_rename = "Leaf crops"]
    LeafCrops,
    #[serde(rename = "Fruit crops")]
    #[db_rename = "Fruit crops"]
    FruitCrops,
    #[serde(rename = "Root crops")]
    #[db_rename = "Root crops"]
    RootCrops,
    #[serde(rename = "Flowering crops")]
    #[db_rename = "Flowering crops"]
    FloweringCrops,
    #[serde(rename = "Herbs")]
    #[db_rename = "Herbs"]
    Herbs,
    #[serde(rename = "Other")]
    #[db_rename = "Other"]
    Other,
}
