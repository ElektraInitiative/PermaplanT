use serde::{Deserialize, Serialize};
use typeshare::typeshare;

#[typeshare]
#[derive(Serialize, Deserialize)]
pub enum Quantity {
    Nothing,
    #[serde(rename = "Not enough")]
    NotEnough,
    Enough,
    #[serde(rename = "More than enough")]
    MoreThanEnough,
}

impl From<Quantity> for String {
    fn from(quantity: Quantity) -> String {
        match quantity {
            Quantity::Nothing => "Nothing".to_string(),
            Quantity::NotEnough => "Not Enough".to_string(),
            Quantity::Enough => "Enough".to_string(),
            Quantity::MoreThanEnough => "More than enough".to_string(),
        }
    }
}
