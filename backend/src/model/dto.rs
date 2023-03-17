//! DTOs of `PermaplanT`.
#![allow(clippy::module_name_repetitions)] // There needs to be a difference between DTOs and entities otherwise imports will be messy.

use chrono::NaiveDate;
use serde::{Deserialize, Serialize};
use typeshare::typeshare;

use super::r#enum::{quality::Quality, quantity::Quantity};

pub mod new_seed_impl;
pub mod plants_impl;
pub mod seed_impl;

#[allow(clippy::missing_docs_in_private_items)] // TODO: See #97.
#[typeshare]
#[derive(Serialize, Deserialize)]
pub struct SeedDto {
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

#[allow(clippy::missing_docs_in_private_items)] // TODO: See #97.
#[typeshare]
#[derive(Serialize, Deserialize)]
pub struct NewSeedDto {
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

#[allow(clippy::missing_docs_in_private_items)] // TODO: See #97.
#[typeshare]
#[derive(Serialize, Deserialize)]
pub struct PlantsDto {
    pub id: i32,
    pub tags: Vec<Option<String>>,
    pub species: String,
    pub plant: Option<String>,
    pub plant_type: Option<i32>,
}
