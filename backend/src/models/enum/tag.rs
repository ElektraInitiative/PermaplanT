use serde::{Deserialize, Serialize};
use typeshare::typeshare;

#[typeshare]
#[derive(Serialize, Deserialize)]
pub enum Tag {
    #[serde(rename = "Leaf crops")]
    LeafCrops,
    #[serde(rename = "Fruit crops")]
    FruitCrops,
    #[serde(rename = "Root crops")]
    RootCrops,
    #[serde(rename = "Flowering crops")]
    FloweringCrops,
    #[serde(rename = "Herbs")]
    Herbs,
    #[serde(rename = "Other")]
    Other,
}

impl From<Tag> for String {
    fn from(tag: Tag) -> String {
        match tag {
            Tag::LeafCrops => "Leaf crops".to_string(),
            Tag::FruitCrops => "Fruit crops".to_string(),
            Tag::RootCrops => "Root crops".to_string(),
            Tag::FloweringCrops => "Flowering crops".to_string(),
            Tag::Herbs => "Herbs".to_string(),
            Tag::Other => "Other".to_string(),
        }
    }
}
