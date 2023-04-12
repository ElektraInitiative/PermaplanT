//! [`Language`] enum.
use diesel_derive_enum::DbEnum;
use serde::{Deserialize, Serialize};
use typeshare::typeshare;
use utoipa::ToSchema;

// This enum is not part of the database.
// It is used to communicate which language is preferred for a certain operation.
#[typeshare]
#[derive(Serialize, Deserialize, DbEnum, Debug, ToSchema)]
pub enum Language {
    English,
    German,
    Latin,
}