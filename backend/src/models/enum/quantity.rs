use serde::{Deserialize, Serialize};
use typeshare::typeshare;

#[typeshare]
#[derive(Serialize, Deserialize)]
pub enum Quantity {
    #[serde(rename = "Nothing")]
    Nothing,
    #[serde(rename = "Not enough")]
    NotEnough,
    #[serde(rename = "Enough")]
    Enough,
    #[serde(rename = "More than enough")]
    MoreThanEnough,
}

impl From<Quantity> for String {
    fn from(quantity: Quantity) -> String {
        match quantity {
            Quantity::Nothing => "Nothing".to_string(),
            Quantity::NotEnough => "Not enough".to_string(),
            Quantity::Enough => "Enough".to_string(),
            Quantity::MoreThanEnough => "More than enough".to_string(),
        }
    }
}

impl From<String> for Quantity {
    fn from(quantity: String) -> Quantity {
        match quantity.as_str() {
            "Nothing" => Quantity::Nothing,
            "Not enough" => Quantity::NotEnough,
            "Enough" => Quantity::Enough,
            "More than enough" => Quantity::MoreThanEnough,
            _ => Quantity::Nothing, // TODO: should this be handled differently? if everything is right this should never occur though
        }
    }
}
