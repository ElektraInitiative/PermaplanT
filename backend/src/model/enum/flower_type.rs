use diesel::sql_types::*;
use serde::{Deserialize, Serialize};

#[derive(DbEnum, Debug, Serialize, Deserialize, ToSchema)]
pub enum FlowerType {
    Dioecious,
    Monoecious,
    Hermaphrodite,
}
