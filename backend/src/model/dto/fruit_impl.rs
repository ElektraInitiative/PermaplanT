use crate::model::entity::Fruit;

use super::FruitDto;

impl From<Fruit> for FruitDto {
    fn from(fruit: Fruit) -> Self {
        Self {
            id: fruit.id,
            name: fruit.name,
            created_at: fruit.created_at,
            updated_at: fruit.updated_at,
        }
    }
}
