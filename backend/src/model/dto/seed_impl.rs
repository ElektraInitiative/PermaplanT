//! Contains the implementation of [`SeedDto`].

use crate::model::entity::Seed;

use super::SeedDto;

impl From<Seed> for SeedDto {
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
