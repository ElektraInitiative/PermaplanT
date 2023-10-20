//! Contains tests for the backend.
// Tests are allowed to fail if something unexpected happened
#![allow(clippy::expect_used, clippy::unwrap_used)]

mod auth;
mod base_layer_image;
mod blossoms;
mod config;
mod guided_tours;
mod layers;
mod map;
mod pagination;
mod plant;
mod plant_layer;
// mod plant_layer_heatmap;
mod plantings;
mod seed;
mod users;
pub mod util;
