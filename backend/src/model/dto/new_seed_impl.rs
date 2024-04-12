//! Contains the implementation of [`NewSeedDto`].

use uuid::Uuid;

use crate::model::entity::NewSeed;

use super::NewSeedDto;

impl From<(NewSeedDto, Uuid)> for NewSeed {
    fn from((new_seed, owner_id): (NewSeedDto, Uuid)) -> Self {
        Self {
            name: new_seed.name,
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
            owner_id,
        }
    }
}
