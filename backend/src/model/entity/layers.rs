use diesel::AsChangeset;
use diesel::{Identifiable, Insertable, Queryable};

use crate::model::r#enum::layer_type::LayerType;
use crate::schema::layers;

/// The `Layer` entity.
#[derive(Identifiable, Queryable)]
#[diesel(table_name = layers)]
pub struct Layer {
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

/// Insert new values into an existing `Layer` entity.
#[derive(Insertable)]
#[diesel(table_name = layers)]
pub struct NewLayer {
    /// The id of the map this layer belongs to.
    pub map_id: i32,
    /// The type of layer.
    pub type_: LayerType,
    /// The name of the layer.
    pub name: String,
    /// A flag indicating if this layer is an user created alternative.
    pub is_alternative: bool,
}

/// Update `Layer` order index.
#[derive(AsChangeset)]
#[diesel(table_name = layers)]
pub struct UpdateLayerOrderIndex {
    /// The id of the layer.
    pub id: i32,
    /// New order index within the map.
    pub order_index: i32,
}

/// Update `Layer` name.
#[derive(AsChangeset)]
#[diesel(table_name = layers)]
pub struct UpdateLayerName {
    /// The id of the layer.
    pub id: i32,
    /// New layer name.
    pub name: String,
}
