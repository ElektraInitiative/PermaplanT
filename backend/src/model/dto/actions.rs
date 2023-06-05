//! Contains all the actions that can be broadcasted via [`Broadcaster`].

// The properties of the actions are not documented because they are
// self-explanatory and should be already documented in the respective
// entity DTOs.
#![allow(clippy::missing_docs_in_private_items)]

use super::PlantLayerObjectDto;
use serde::Serialize;
use typeshare::typeshare;

#[typeshare]
#[derive(Debug, Serialize, Clone)]
/// The meta data of an action.
pub struct ActionMeta {
    /// The type of the action.
    #[serde(rename = "type")]
    _type: String,
    /// The id of the user that triggered the action.
    #[serde(rename = "userId")]
    user_id: String,
}

#[typeshare]
#[derive(Debug, Serialize, Clone)]
/// An action used to broadcast creation of a plant.
pub struct CreatePlantActionDto {
    #[serde(flatten)]
    meta: ActionMeta,
    payload: CreatePlantActionPayload,
}

#[typeshare]
/// The payload of the [`CreatePlantActionDto`].
pub type CreatePlantActionPayload = PlantLayerObjectDto;

impl CreatePlantActionDto {
    #[must_use]
    pub fn new(payload: CreatePlantActionPayload, user_id: String) -> Self {
        Self {
            meta: ActionMeta {
                _type: "CREATE_PLANT".to_owned(),
                user_id,
            },
            payload,
        }
    }
}

#[typeshare]
#[derive(Debug, Serialize, Clone)]
/// An action used to broadcast deletion of a plant.
pub struct DeletePlantActionDto {
    #[serde(flatten)]
    meta: ActionMeta,
    payload: DeletePlantActionPayload,
}

#[typeshare]
#[derive(Debug, Serialize, Clone)]
/// The payload of the [`DeletePlantActionDto`].
pub struct DeletePlantActionPayload {
    id: String,
}

impl DeletePlantActionDto {
    #[must_use]
    pub fn new(id: String, user_id: String) -> Self {
        Self {
            meta: ActionMeta {
                _type: "DELETE_PLANT".to_owned(),
                user_id,
            },
            payload: DeletePlantActionPayload { id },
        }
    }
}

#[typeshare]
#[derive(Debug, Serialize, Clone)]
/// An action used to broadcast movement of a plant.
pub struct MovePlantActionDto {
    #[serde(flatten)]
    meta: ActionMeta,
    payload: MovePlantActionPayload,
}

#[typeshare]
#[derive(Debug, Serialize, Clone)]
/// The payload of the [`MovePlantActionDto`].
pub struct MovePlantActionPayload {
    id: String,
    x: f32,
    y: f32,
}

impl MovePlantActionDto {
    #[must_use]
    pub fn new(payload: PlantLayerObjectDto, user_id: String) -> Self {
        Self {
            meta: ActionMeta {
                _type: "MOVE_PLANT".to_owned(),
                user_id,
            },
            payload: MovePlantActionPayload {
                id: payload.id,
                x: payload.x,
                y: payload.y,
            },
        }
    }
}

#[typeshare]
#[derive(Debug, Serialize, Clone)]
/// An action used to broadcast transformation of a plant.
pub struct TransformPlantActionDto {
    #[serde(flatten)]
    meta: ActionMeta,
    payload: TransformPlantActionPayload,
}

#[typeshare]
#[derive(Debug, Serialize, Clone)]
/// The payload of the [`TransformPlantActionDto`].
pub struct TransformPlantActionPayload {
    id: String,
    x: f32,
    y: f32,
    rotation: f32,
    #[serde(rename = "scaleX")]
    scale_x: f32,
    #[serde(rename = "scaleY")]
    scale_y: f32,
}

impl TransformPlantActionDto {
    #[must_use]
    pub fn new(payload: PlantLayerObjectDto, user_id: String) -> Self {
        Self {
            meta: ActionMeta {
                _type: "TRANSFORM_PLANT".to_owned(),
                user_id,
            },
            payload: TransformPlantActionPayload {
                id: payload.id,
                x: payload.x,
                y: payload.y,
                rotation: payload.rotation,
                scale_x: payload.scale_x,
                scale_y: payload.scale_y,
            },
        }
    }
}
