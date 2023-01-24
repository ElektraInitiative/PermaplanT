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

impl From<String> for Tag {
    fn from(tag: String) -> Tag {
        match tag.as_str() {
            "Leaf crops" => Tag::LeafCrops,
            "Fruit crops" => Tag::FruitCrops,
            "Root crops" => Tag::RootCrops,
            "Flowering crops" => Tag::FloweringCrops,
            "Herbs" => Tag::Herbs,
            "Other" => Tag::Other,
            _ => Tag::Other,
        }
    }
}
