use serde::{Deserialize, Serialize};
use typeshare::typeshare;

#[typeshare]
#[derive(Serialize, Deserialize)]
pub enum Quality {
    #[serde(rename = "Organic")]
    Organic,
    #[serde(rename = "Not organic")]
    NotOrganic,
    #[serde(rename = "Unknown")]
    Unknown,
}

impl From<Quality> for String {
    fn from(quality: Quality) -> String {
        match quality {
            Quality::Organic => "Organic".to_string(),
            Quality::NotOrganic => "Not organic".to_string(),
            Quality::Unknown => "Unknown".to_string(),
        }
    }
}
