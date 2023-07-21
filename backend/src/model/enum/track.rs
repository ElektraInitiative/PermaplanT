/// [`Track`] enum.
use diesel_derive_enum::DbEnum;
use serde::{Deserialize, Serialize};
use typeshare::typeshare;
use utoipa::ToSchema;

/// Enum containing all possible Blossom tracks.
#[typeshare]
#[derive(Serialize, Deserialize, DbEnum, Debug, ToSchema)]
#[ExistingTypePath = "crate::schema::sql_types::Track"]
pub enum Track {
    /// Track for Blossoms aimed at new users.
    #[serde(rename = "Beginners Track")]
    #[db_rename = "Beginners Track"]
    BeginnersTrack,
    /// Track for Blossoms aimed to be repeated every season.
    #[serde(rename = "Seasonal Track")]
    #[db_rename = "Seasonal Track"]
    SeasonalTrack,
    /// Track for Blossoms aimed at users that want to do everything PermaplanT has to offer.
    #[serde(rename = "Completionist Track")]
    #[db_rename = "Completionist Track"]
    CompletionistTrack,
    /// Track for Blossoms aimed at user that want to prove their expertise by helping others.
    #[serde(rename = "Expert Track")]
    #[db_rename = "Expert Track"]
    ExpertTrack,
}
