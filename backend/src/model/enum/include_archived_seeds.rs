//! [`IncludeArchivedSeeds`] enum.

use serde::{Deserialize, Serialize};
use typeshare::typeshare;

/// Indicates whether archived seeds should be returned in a seed query.
#[typeshare]
#[derive(Serialize, Deserialize, Debug)]
pub enum IncludeArchivedSeeds {
    #[serde(rename = "not_archvied")]
    NotArchived,
    #[serde(rename = "archived")]
    Archived,
    #[serde(rename = "both")]
    Both,
}
