//! Contains all entities used in `PermaplanT`.

pub mod plants_impl;
pub mod seed_impl;

use chrono::NaiveDate;
use diesel::{Identifiable, Insertable, Queryable};

use crate::schema::{plants, seeds};

use super::r#enum::{quality::Quality, quantity::Quantity};

/// The `Plants` entity.
#[allow(clippy::missing_docs_in_private_items)] // TODO: See #97.
#[derive(Identifiable, Queryable)]
#[diesel(table_name = plants)]
pub struct Plants {
    pub id: i32,
    pub tags: Vec<Option<String>>,
    pub species: String,
    pub plant: Option<String>,
    pub plant_type: Option<i32>,
}

/// The `Seed` entity.
#[allow(clippy::missing_docs_in_private_items)] // TODO: See #97.
#[derive(Identifiable, Queryable)]
#[diesel(table_name = seeds)]
pub struct Seed {
    pub id: i32,
    pub name: String,
    pub plant_id: Option<i32>,
    pub harvest_year: i16,
    pub use_by: Option<NaiveDate>,
    pub origin: Option<String>,
    pub taste: Option<String>,
    pub yield_: Option<String>,
    pub quantity: Quantity,
    pub quality: Option<Quality>,
    pub price: Option<i16>,
    pub generation: Option<i16>,
    pub notes: Option<String>,
    pub variety: Option<String>,
}

/// The `NewSeed` entity.
#[allow(clippy::missing_docs_in_private_items)] // TODO: See #97.
#[derive(Insertable)]
#[diesel(table_name = seeds)]
pub struct NewSeed {
    pub name: String,
    pub plant_id: Option<i32>,
    pub harvest_year: i16,
    pub use_by: Option<NaiveDate>,
    pub origin: Option<String>,
    pub taste: Option<String>,
    pub yield_: Option<String>,
    pub quantity: Quantity,
    pub quality: Option<Quality>,
    pub price: Option<i16>,
    pub generation: Option<i16>,
    pub notes: Option<String>,
    pub variety: Option<String>,
}
