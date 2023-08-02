//! [`LayerType`] enum.

use core::fmt;

use diesel_derive_enum::DbEnum;
use serde::{Deserialize, Serialize};
use typeshare::typeshare;
use utoipa::ToSchema;

/// Enum for all possible layer types.
#[typeshare]
#[derive(Serialize, Deserialize, DbEnum, Debug, ToSchema, Clone, Copy, PartialEq, Eq)]
#[ExistingTypePath = "crate::schema::sql_types::LayerType"]
pub enum LayerType {
    /// Identifier for Base Layer.
    #[serde(rename = "base")]
    #[db_rename = "base"]
    Base,
    /// Identifier for Soil Layer.
    #[serde(rename = "soil")]
    #[db_rename = "soil"]
    Soil,
    /// Identifier for Todo Layer.
    #[serde(rename = "todo")]
    #[db_rename = "todo"]
    Todo,
    /// Identifier for Label Layer.
    #[serde(rename = "label")]
    #[db_rename = "label"]
    Label,
    /// Identifier for Paths Layer.
    #[serde(rename = "paths")]
    #[db_rename = "paths"]
    Paths,
    /// Identifier for Photo Layer.
    #[serde(rename = "photo")]
    #[db_rename = "photo"]
    Photo,
    /// Identifier for Shade Layer.
    #[serde(rename = "shade")]
    #[db_rename = "shade"]
    Shade,
    /// Identifier for Trees Layer.
    #[serde(rename = "trees")]
    #[db_rename = "trees"]
    Trees,
    /// Identifier for Winds Layer.
    #[serde(rename = "winds")]
    #[db_rename = "winds"]
    Winds,
    /// Identifier for Zones Layer.
    #[serde(rename = "zones")]
    #[db_rename = "zones"]
    Zones,
    /// Identifier for Plants Layer.
    #[serde(rename = "plants")]
    #[db_rename = "plants"]
    Plants,
    /// Identifier for Drawing Layer.
    #[serde(rename = "drawing")]
    #[db_rename = "drawing"]
    Drawing,
    /// Identifier for Terrain Layer.
    #[serde(rename = "terrain")]
    #[db_rename = "terrain"]
    Terrain,
    /// Identifier for Habitats Layer.
    #[serde(rename = "habitats")]
    #[db_rename = "habitats"]
    Habitats,
    /// Identifier for Warnings Layer.
    #[serde(rename = "warnings")]
    #[db_rename = "warnings"]
    Warnings,
    /// Identifier for Watering Layer.
    #[serde(rename = "watering")]
    #[db_rename = "watering"]
    Watering,
    /// Identifier for Landscape Layer.
    #[serde(rename = "landscape")]
    #[db_rename = "landscape"]
    Landscape,
    /// Identifier for Hydrology Layer.
    #[serde(rename = "hydrology")]
    #[db_rename = "hydrology"]
    Hydrology,
    /// Identifier for Fertilization Layer.
    #[serde(rename = "fertilization")]
    #[db_rename = "fertilization"]
    Fertilization,
    /// Identifier for Infrastructure Layer.
    #[serde(rename = "infrastructure")]
    #[db_rename = "infrastructure"]
    Infrastructure,
}

impl fmt::Display for LayerType {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        match self {
            Self::Base => write!(f, "Base"),
            Self::Soil => write!(f, "Soil"),
            Self::Todo => write!(f, "Todo"),
            Self::Label => write!(f, "Label"),
            Self::Paths => write!(f, "Paths"),
            Self::Photo => write!(f, "Photo"),
            Self::Shade => write!(f, "Shade"),
            Self::Trees => write!(f, "Trees"),
            Self::Winds => write!(f, "Winds"),
            Self::Zones => write!(f, "Zones"),
            Self::Plants => write!(f, "Plants"),
            Self::Drawing => write!(f, "Drawing"),
            Self::Terrain => write!(f, "Terrain"),
            Self::Habitats => write!(f, "Habitats"),
            Self::Warnings => write!(f, "Warnings"),
            Self::Watering => write!(f, "Watering"),
            Self::Landscape => write!(f, "Landscape"),
            Self::Hydrology => write!(f, "Hydrology"),
            Self::Fertilization => write!(f, "Fertilization"),
            Self::Infrastructure => write!(f, "Infrastructure"),
        }
    }
}
