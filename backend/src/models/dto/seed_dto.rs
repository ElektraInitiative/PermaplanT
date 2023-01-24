use chrono::NaiveDate;
use serde::{Deserialize, Serialize};
use typeshare::typeshare;

use crate::models::{
    r#enum::{quality::Quality, quantity::Quantity, tag::Tag},
    seed::Seed,
};

#[typeshare]
#[derive(Serialize, Deserialize)]
pub struct SeedDTO {
    pub id: i32,
    pub name: String,
    pub variety_id: i32,
    pub harvest_year: i16,
    pub quantity: Quantity,
    pub tags: Vec<Option<Tag>>,
    pub use_by: Option<NaiveDate>,
    pub origin: Option<String>,
    pub taste: Option<String>,
    pub yield_: Option<String>,
    pub generation: Option<i16>,
    pub quality: Option<Quality>,
    pub price: Option<i16>,
    pub notes: Option<String>,
}

impl From<Seed> for SeedDTO {
    fn from(seed: Seed) -> Self {
        let quantity = Quantity::from(seed.quantity);
        let quality = match seed.quality {
            Some(quality) => Some(Quality::from(quality)),
            None => None,
        };

        let tags: Vec<Option<Tag>> = seed
            .tags
            .into_iter()
            .map(|tag| tag.map(|tag| Tag::from(tag)))
            .collect();

        SeedDTO {
            id: seed.id,
            name: seed.name,
            variety_id: seed.variety_id,
            harvest_year: seed.harvest_year,
            quantity: quantity,
            tags: tags,
            use_by: seed.use_by,
            origin: seed.origin,
            taste: seed.taste,
            yield_: seed.yield_,
            generation: seed.generation,
            quality: quality,
            price: seed.price,
            notes: seed.notes,
        }
    }
}
