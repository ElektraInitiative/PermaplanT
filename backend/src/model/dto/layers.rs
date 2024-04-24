use serde::Deserialize;
use serde::Serialize;
use typeshare::typeshare;
use utoipa::IntoParams;
use utoipa::ToSchema;

use crate::model::r#enum::layer_type::LayerType;

/// A Dto that represenets a layer on a map.
#[typeshare]
#[derive(Serialize, Deserialize, ToSchema, Debug, Clone)]
pub struct LayerDto {
    /// The id of the layer.
    pub id: i32,
    /// The id of the map this layer belongs to.
    pub map_id: i32,
    /// The type of layer.
    pub type_: LayerType,
    /// The name of the layer.
    pub name: String,
    /// A flag indicating if this layer is an user created alternative.
    pub is_alternative: bool,
    /// Order within the map.
    pub order_index: i32,
}

/// The information of a layer neccessary for its creation.
#[typeshare]
#[derive(Serialize, Deserialize, ToSchema)]
pub struct NewLayerDto {
    /// The type of layer.
    pub type_: LayerType,
    /// The name of the layer.
    pub name: String,
    /// A flag indicating if this layer is an user created alternative.
    pub is_alternative: bool,
}

/// Query parameters for searching layers.
#[typeshare]
#[derive(Debug, Deserialize, IntoParams)]
pub struct LayerSearchParameters {
    /// The parent map.
    pub map_id: Option<i32>,
    /// The type of layer.
    pub type_: Option<LayerType>,
    /// Whether or not the layer is an alternative.
    pub is_alternative: Option<bool>,
}

/// Query parameters for searching layers.
#[typeshare]
#[derive(Debug, Deserialize, IntoParams)]
pub struct LayerRenameDto {
    /// The layer id.
    pub id: i32,
    /// The new name.
    pub name: String,
}
