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
