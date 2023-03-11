//! Contains the implementation of [`NewSeedDto`].

use crate::model::entity::NewSeed;

use super::NewSeedDto;

impl From<NewSeedDto> for NewSeed {
    fn from(new_seed: NewSeedDto) -> Self {
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
