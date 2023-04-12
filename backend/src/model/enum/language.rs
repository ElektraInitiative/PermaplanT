//! [`Language`] enum.
use serde::{Deserialize, Serialize};
use typeshare::typeshare;
use utoipa::ToSchema;

// This enum is not part of the database.
// It is used to communicate which language is preferred for a certain operation.
#[typeshare]
#[derive(Serialize, Deserialize, Debug, ToSchema)]
pub enum Language {
    #[serde(rename = "english")]
    English,

    #[serde(rename = "german")]
    German,

    #[serde(rename = "latin")]
    Latin,
}