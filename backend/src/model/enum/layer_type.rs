//! [`LayerType`] enum.

use std::str::FromStr;

use diesel_derive_enum::DbEnum;
use serde::{Deserialize, Serialize};
use typeshare::typeshare;
use utoipa::ToSchema;

/// Enum for all possible layer types.
#[typeshare]
#[derive(Serialize, Deserialize, DbEnum, Debug, ToSchema)]
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

impl FromStr for LayerType {
    type Err = ();

    fn from_str(s: &str) -> Result<Self, Self::Err> {
        match s {
            "Base" => Ok(Self::Base),
            "Drawing" => Ok(Self::Drawing),
            "Fertilization" => Ok(Self::Fertilization),
            "Habitats" => Ok(Self::Habitats),
            "Hydrology" => Ok(Self::Hydrology),
            "Infrastructure" => Ok(Self::Infrastructure),
            "Label" => Ok(Self::Label),
            "Landscape" => Ok(Self::Landscape),
            "Paths" => Ok(Self::Paths),
            "Photo" => Ok(Self::Photo),
            "Plants" => Ok(Self::Plants),
            "Shade" => Ok(Self::Shade),
            "Soil" => Ok(Self::Soil),
            "Terrain" => Ok(Self::Terrain),
            "Todo" => Ok(Self::Todo),
            "Trees" => Ok(Self::Trees),
            "Warnings" => Ok(Self::Warnings),
            "Watering" => Ok(Self::Watering),
            "Winds" => Ok(Self::Winds),
            "Zones" => Ok(Self::Zones),
            _ => Err(()),
        }
    }
}
