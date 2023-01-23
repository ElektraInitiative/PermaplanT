use std::str::FromStr;

use crate::models::{r#enum::tag::Tag, variety::Varietie};
use serde::{Deserialize, Serialize};
use typeshare::typeshare;

#[typeshare]
#[derive(Serialize, Deserialize)]
pub struct VarietyDto {
    pub id: i32,
    pub tags: Vec<Tag>,
    pub species: String,
    pub variety: Option<String>,
}

impl From<Varietie> for VarietyDto {
    fn from(variety: Varietie) -> Self {
        let tags: Vec<Tag> = variety
            .tags
            .into_iter()
            .filter_map(|tag| Tag::from_str(tag?.as_str()).ok())
            .collect();

        VarietyDto {
            id: variety.id,
            tags: tags,
            species: variety.species,
            variety: variety.variety,
        }
    }
}
