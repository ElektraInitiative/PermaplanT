//! Contains all the actions that can be broadcasted via [`crate::sse::broadcaster::Broadcaster`].

// The properties of the actions are not documented because they are
// self-explanatory and should be already documented in the respective
// entity DTOs.
#![allow(clippy::missing_docs_in_private_items)]
// Don't make the `new` functions const, there might come more fields in the future.
#![allow(clippy::missing_const_for_fn)]

use crate::model::dto::plantings::PlantingDto;
use chrono::NaiveDate;
use postgis_diesel::types::{Point, Polygon};
use serde::Serialize;
use typeshare::typeshare;
use uuid::Uuid;

use super::{
    drawings::DrawingDto,
    plantings::{
        DeletePlantingDto, MovePlantingDto, TransformPlantingDto, UpdateAddDatePlantingDto,
        UpdatePlantingNoteDto, UpdateRemoveDatePlantingDto,
    },
    BaseLayerImageDto, UpdateMapGeometryDto,
};

#[typeshare]
#[derive(Debug, Serialize, Clone)]
// Use the name of the enum variant as the type field looking like { "type": "CreatePlanting", ... }.
/// An enum representing all the actions that can be broadcasted via [`crate::sse::broadcaster::Broadcaster`].
#[serde(tag = "type", content = "payload")]
pub enum Action {
    /// An action used to broadcast creation of a plant.
    CreatePlanting(ActionWrapper<Vec<CreatePlantActionPayload>>),
    /// An action used to broadcast deletion of a plant.
    DeletePlanting(ActionWrapper<Vec<DeletePlantActionPayload>>),
    /// An action used to broadcast movement of a plant.
    MovePlanting(ActionWrapper<Vec<MovePlantActionPayload>>),
    /// An action used to broadcast transformation of a plant.
    TransformPlanting(ActionWrapper<Vec<TransformPlantActionPayload>>),
    /// An action used to update the `add_date` of a plant.
    UpdatePlantingAddDate(ActionWrapper<Vec<UpdateAddDateActionPayload>>),
    /// An action used to update the `remove_date` of a plant.
    UpdatePlantingRemoveDate(ActionWrapper<Vec<UpdateRemoveDateActionPayload>>),
    /// An action used to broadcast updating a Markdown notes of a plant.
    UpdatePlatingNotes(ActionWrapper<Vec<UpdatePlantingNoteActionPayload>>),
    /// An action used to broadcast creation of a baseLayerImage.
    CreateBaseLayerImage(ActionWrapper<CreateBaseLayerImageActionPayload>),
    /// An action used to broadcast update of a baseLayerImage.
    UpdateBaseLayerImage(ActionWrapper<UpdateBaseLayerImageActionPayload>),
    /// An action used to broadcast deletion of a baseLayerImage.
    DeleteBaseLayerImage(ActionWrapper<DeleteBaseLayerImageActionPayload>),
    /// An action used to broadcast an update to the map geometry.
    UpdateMapGeometry(ActionWrapper<UpdateMapGeometryActionPayload>),
    /// An action used to update the `additional_name` of a plant.
    UpdatePlantingAdditionalName(ActionWrapper<UpdatePlantingAdditionalNamePayload>),

    /// An action used to broadcast creation of a new drawing shape.
    CreateDrawing(ActionWrapper<Vec<DrawingDto>>),
    /// An action used to broadcast deletion of an existing drawing shape.
    DeleteDrawing(ActionWrapper<Vec<Uuid>>),
    /// An action used to broadcast the update of an existing drawing shape.
    UpdateDrawing(ActionWrapper<Vec<DrawingDto>>),
    /// An action used to update the `add_date` of a drawing.
    UpdateDrawingAddDate(ActionWrapper<Vec<DrawingDto>>),
    /// An action used to update the `remove_date` of a drawing.
    UpdateDrawingRemoveDate(ActionWrapper<Vec<DrawingDto>>),
}

#[typeshare]
#[derive(Debug, Serialize, Clone)]
#[serde(rename_all = "camelCase")]
pub struct ActionWrapper<T> {
    pub action_id: Uuid,
    pub user_id: Uuid,
    pub payload: T,
}

impl Action {
    /// Returns the `action_id` of the action.
    #[must_use]
    pub fn action_id(&self) -> Uuid {
        match self {
            Self::CreatePlanting(ActionWrapper { action_id, .. })
            | Self::DeletePlanting(ActionWrapper { action_id, .. })
            | Self::MovePlanting(ActionWrapper { action_id, .. })
            | Self::TransformPlanting(ActionWrapper { action_id, .. })
            | Self::UpdatePlatingNotes(ActionWrapper { action_id, .. })
            | Self::CreateBaseLayerImage(ActionWrapper { action_id, .. })
            | Self::UpdateBaseLayerImage(ActionWrapper { action_id, .. })
            | Self::DeleteBaseLayerImage(ActionWrapper { action_id, .. })
            | Self::UpdatePlantingAddDate(ActionWrapper { action_id, .. })
            | Self::UpdatePlantingRemoveDate(ActionWrapper { action_id, .. })
            | Self::UpdatePlantingAdditionalName(ActionWrapper { action_id, .. })
            | Self::UpdateMapGeometry(ActionWrapper { action_id, .. })
            | Self::CreateDrawing(ActionWrapper { action_id, .. })
            | Self::UpdateDrawing(ActionWrapper { action_id, .. })
            | Self::DeleteDrawing(ActionWrapper { action_id, .. })
            | Self::UpdateDrawingAddDate(ActionWrapper { action_id, .. })
            | Self::UpdateDrawingRemoveDate(ActionWrapper { action_id, .. }) => *action_id,
        }
    }

    #[must_use]
    pub fn new_create_planting_action(
        dtos: &[PlantingDto],
        user_id: Uuid,
        action_id: Uuid,
    ) -> Self {
        Self::CreatePlanting(ActionWrapper {
            action_id,
            user_id,
            payload: dtos
                .iter()
                .map(|dto| CreatePlantActionPayload {
                    id: dto.id,
                    layer_id: dto.layer_id,
                    plant_id: dto.plant_id,
                    x: dto.x,
                    y: dto.y,
                    rotation: dto.rotation,
                    size_x: dto.size_x,
                    size_y: dto.size_y,
                    add_date: dto.add_date,
                    remove_date: dto.remove_date,
                    seed_id: dto.seed_id,
                    additional_name: dto.additional_name.clone(),
                    is_area: dto.is_area,
                })
                .collect(),
        })
    }

    #[must_use]
    pub fn new_delete_planting_action(
        dtos: &[DeletePlantingDto],
        user_id: Uuid,
        action_id: Uuid,
    ) -> Self {
        Self::DeletePlanting(ActionWrapper {
            action_id,
            user_id,
            payload: dtos
                .iter()
                .map(|dto| DeletePlantActionPayload { id: dto.id })
                .collect(),
        })
    }

    #[must_use]
    pub fn new_move_planting_action(
        dtos: &[MovePlantingDto],
        user_id: Uuid,
        action_id: Uuid,
    ) -> Self {
        Self::MovePlanting(ActionWrapper {
            action_id,
            user_id,
            payload: dtos
                .iter()
                .map(|dto| MovePlantActionPayload {
                    id: dto.id,
                    x: dto.x,
                    y: dto.y,
                })
                .collect(),
        })
    }

    #[must_use]
    pub fn new_transform_planting_action(
        dtos: &[TransformPlantingDto],
        user_id: Uuid,
        action_id: Uuid,
    ) -> Self {
        Self::TransformPlanting(ActionWrapper {
            action_id,
            user_id,
            payload: dtos
                .iter()
                .map(|dto| TransformPlantActionPayload {
                    id: dto.id,
                    x: dto.x,
                    y: dto.y,
                    rotation: dto.rotation,
                    size_x: dto.size_x,
                    size_y: dto.size_y,
                })
                .collect(),
        })
    }

    #[must_use]
    pub fn new_update_planting_add_date_action(
        dtos: &[UpdateAddDatePlantingDto],
        user_id: Uuid,
        action_id: Uuid,
    ) -> Self {
        Self::UpdatePlantingAddDate(ActionWrapper {
            action_id,
            user_id,
            payload: dtos
                .iter()
                .map(|dto| UpdateAddDateActionPayload {
                    id: dto.id,
                    add_date: dto.add_date,
                })
                .collect(),
        })
    }

    #[must_use]
    pub fn new_update_planting_remove_date_action(
        dtos: &[UpdateRemoveDatePlantingDto],
        user_id: Uuid,
        action_id: Uuid,
    ) -> Self {
        Self::UpdatePlantingRemoveDate(ActionWrapper {
            action_id,
            user_id,
            payload: dtos
                .iter()
                .map(|dto| UpdateRemoveDateActionPayload {
                    id: dto.id,
                    remove_date: dto.remove_date,
                })
                .collect(),
        })
    }

    #[must_use]
    pub fn new_update_planting_note_action(
        dtos: &[UpdatePlantingNoteDto],
        user_id: Uuid,
        action_id: Uuid,
    ) -> Self {
        Self::UpdatePlatingNotes(ActionWrapper {
            action_id,
            user_id,
            payload: dtos
                .iter()
                .map(|dto| UpdatePlantingNoteActionPayload {
                    id: dto.id,
                    notes: dto.notes.clone(),
                })
                .collect(),
        })
    }
}

#[typeshare]
#[derive(Debug, Serialize, Clone)]
/// The payload of the [`Action::CreatePlanting`].
/// This struct should always match [`PlantingDto`].
#[serde(rename_all = "camelCase")]
pub struct CreatePlantActionPayload {
    id: Uuid,
    layer_id: i32,
    plant_id: i32,
    x: i32,
    y: i32,
    rotation: f32,
    size_x: i32,
    size_y: i32,
    add_date: Option<NaiveDate>,
    remove_date: Option<NaiveDate>,
    seed_id: Option<i32>,
    additional_name: Option<String>,
    is_area: bool,
}

#[typeshare]
#[derive(Debug, Serialize, Clone)]
/// The payload of the [`Action::DeletePlanting`].
#[serde(rename_all = "camelCase")]
pub struct DeletePlantActionPayload {
    id: Uuid,
}

#[typeshare]
#[derive(Debug, Serialize, Clone)]
/// The payload of the [`Action::MovePlanting`].
#[serde(rename_all = "camelCase")]
pub struct MovePlantActionPayload {
    id: Uuid,
    x: i32,
    y: i32,
}

#[typeshare]
#[derive(Debug, Serialize, Clone)]
/// The payload of the [`Action::TransformPlanting`].
#[serde(rename_all = "camelCase")]
pub struct TransformPlantActionPayload {
    id: Uuid,
    x: i32,
    y: i32,
    rotation: f32,
    size_x: i32,
    size_y: i32,
}

#[typeshare]
#[derive(Debug, Serialize, Clone)]
/// The payload of the [`Action::UpdatePlatingNotes`].
#[serde(rename_all = "camelCase")]
pub struct UpdatePlantingNoteActionPayload {
    id: Uuid,
    notes: String,
}

#[typeshare]
#[derive(Debug, Serialize, Clone)]
/// The payload of the [`Action::CreateBaseLayerImage`].
/// This struct should always match [`BaseLayerImageDto`].
#[serde(rename_all = "camelCase")]
pub struct CreateBaseLayerImageActionPayload {
    id: Uuid,
    layer_id: i32,
    rotation: f32,
    scale: f32,
    path: String,
}

impl CreateBaseLayerImageActionPayload {
    #[must_use]
    pub fn new(payload: BaseLayerImageDto) -> Self {
        Self {
            id: payload.id,
            layer_id: payload.layer_id,
            rotation: payload.rotation,
            scale: payload.scale,
            path: payload.path,
        }
    }
}

#[typeshare]
#[derive(Debug, Serialize, Clone)]
/// The payload of the [`Action::DeleteBaseLayerImage`].
#[serde(rename_all = "camelCase")]
pub struct DeleteBaseLayerImageActionPayload {
    id: Uuid,
}

impl DeleteBaseLayerImageActionPayload {
    #[must_use]
    pub fn new(id: Uuid) -> Self {
        Self { id }
    }
}

#[typeshare]
#[derive(Debug, Serialize, Clone)]
/// The payload of the [`Action::UpdateBaseLayerImage`].
#[serde(rename_all = "camelCase")]
pub struct UpdateBaseLayerImageActionPayload {
    id: Uuid,
    layer_id: i32,
    rotation: f32,
    scale: f32,
    path: String,
}

impl UpdateBaseLayerImageActionPayload {
    #[must_use]
    pub fn new(payload: BaseLayerImageDto) -> Self {
        Self {
            id: payload.id,
            layer_id: payload.layer_id,
            rotation: payload.rotation,
            scale: payload.scale,
            path: payload.path,
        }
    }
}

#[typeshare]
#[derive(Debug, Serialize, Clone)]
/// The payload of the actions [`Action::]`].
#[serde(rename_all = "camelCase")]
pub struct UpdateAddDateActionPayload {
    id: Uuid,
    add_date: Option<NaiveDate>,
}

#[typeshare]
#[derive(Debug, Serialize, Clone)]
/// The payload of the [`Action::UpdatePlantingRemoveDate`].
#[serde(rename_all = "camelCase")]
pub struct UpdateRemoveDateActionPayload {
    id: Uuid,
    remove_date: Option<NaiveDate>,
}

#[typeshare]
#[derive(Debug, Serialize, Clone)]
/// The payload of the [`Action::UpdateMapGeometry`].
#[serde(rename_all = "camelCase")]
pub struct UpdateMapGeometryActionPayload {
    /// The entity id for this action.
    map_id: i32,
    // E.g. `{"rings": [[{"x": 0.0,"y": 0.0},{"x": 1000.0,"y": 0.0},{"x": 1000.0,"y": 1000.0},{"x": 0.0,"y": 1000.0},{"x": 0.0,"y": 0.0}]],"srid": 4326}`
    #[typeshare(serialized_as = "object")]
    geometry: Polygon<Point>,
}

impl UpdateMapGeometryActionPayload {
    #[must_use]
    pub fn new(payload: UpdateMapGeometryDto, map_id: i32) -> Self {
        Self {
            map_id,
            geometry: payload.geometry,
        }
    }
}

#[typeshare]
#[derive(Debug, Serialize, Clone)]
/// The payload of the [`Action::UpdatePlantingRemoveDate`].
#[serde(rename_all = "camelCase")]
pub struct UpdatePlantingAdditionalNamePayload {
    id: Uuid,
    additional_name: Option<String>,
}

impl UpdatePlantingAdditionalNamePayload {
    #[must_use]
    pub fn new(payload: &PlantingDto, new_additional_name: Option<String>) -> Self {
        Self {
            id: payload.id,
            additional_name: new_additional_name,
        }
    }
}
