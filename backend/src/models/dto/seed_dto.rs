use chrono::NaiveDate;
use serde::{Deserialize, Serialize};
use typeshare::typeshare;

use crate::models::{
    r#enum::{quality::Quality, quantity::Quantity},
    seed::Seed,
};

#[typeshare]
#[derive(Serialize, Deserialize)]
pub struct SeedDTO {
    pub id: i32,
    pub name: String,
    pub variety: Option<String>,
    pub plant_id: Option<i32>,
    pub harvest_year: i16,
    pub quantity: Quantity,
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
        Self {
            id: seed.id,
            name: seed.name,
            variety: seed.variety,
            plant_id: seed.plant_id,
            harvest_year: seed.harvest_year,
            quantity: seed.quantity,
            use_by: seed.use_by,
            origin: seed.origin,
            taste: seed.taste,
            yield_: seed.yield_,
            generation: seed.generation,
            quality: seed.quality,
            price: seed.price,
            notes: seed.notes,
        }
    }
}
