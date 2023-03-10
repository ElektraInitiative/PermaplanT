use crate::models::r#enum::quality::Quality;
use crate::models::r#enum::quantity::Quantity;
use crate::models::seed::NewSeed;
use chrono::NaiveDate;
use serde::{Deserialize, Serialize};
use typeshare::typeshare;

#[typeshare]
#[derive(Serialize, Deserialize)]
pub struct NewSeedDTO {
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

impl From<NewSeedDTO> for NewSeed {
    fn from(new_seed: NewSeedDTO) -> Self {
        Self {
            name: new_seed.name,
            variety: new_seed.variety,
            plant_id: new_seed.plant_id,
            harvest_year: new_seed.harvest_year,
            quantity: new_seed.quantity,
            use_by: new_seed.use_by,
            origin: new_seed.origin,
            taste: new_seed.taste,
            yield_: new_seed.yield_,
            generation: new_seed.generation,
            quality: new_seed.quality,
            price: new_seed.price,
            notes: new_seed.notes,
        }
    }
}
