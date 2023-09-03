//! [`IncludeArchivedSeeds`] enum.

use serde::{Deserialize, Serialize};
use typeshare::typeshare;

/// Indicates whether archived seeds should be returned in a seed query.
#[typeshare]
#[derive(Serialize, Deserialize, Debug)]
pub enum IncludeArchivedSeeds {
    #[serde(rename = "not_archvied")]
    /// Return only seeds that have not been archived.
    NotArchived,
    #[serde(rename = "archived")]
    /// Return only archived seeds.
    Archived,
    #[serde(rename = "both")]
    /// Return all seeds
    Both,
}
