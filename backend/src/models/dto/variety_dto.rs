//! [`VarietyDTO`] and its implementation.

use crate::models::variety::Variety;
use serde::{Deserialize, Serialize};
use typeshare::typeshare;

#[allow(clippy::missing_docs_in_private_items)] // TODO: document
#[typeshare]
#[derive(Serialize, Deserialize)]
pub struct VarietyDTO {
    pub id: i32,
    pub tags: Vec<Option<String>>,
    pub species: String,
    pub variety: Option<String>,
}

impl From<Variety> for VarietyDTO {
    fn from(variety: Variety) -> Self {
        Self {
            id: variety.id,
            tags: variety.tags,
            species: variety.species,
            variety: variety.variety,
        }
    }
}
