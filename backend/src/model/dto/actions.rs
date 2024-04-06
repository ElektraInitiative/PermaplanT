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

/// Actions broadcast events to other users viewing the same map,
/// so that they can update the map state appropriately.
/// It keeps all users on the map in sync via [`crate::sse::broadcaster::Broadcaster`]
#[typeshare]
#[derive(Debug, Serialize, Clone)]
#[serde(rename_all = "camelCase")]
pub struct Action {
    pub action_id: Uuid,
    pub user_id: Uuid,
    pub action: ActionType,
}

#[typeshare]
#[derive(Debug, Serialize, Clone)]
// Use the name of the enum variant as the field "type" looking like
/// { "type": "CreatePlanting", "payload": ... }.
#[serde(tag = "type", content = "payload")]
pub enum ActionType {
    /// New plantings have been created.
    CreatePlanting(Vec<PlantingDto>),
    /// Existing plantings have been deleted.
    DeletePlanting(Vec<DeletePlantActionPayload>),
    /// Plantings have been moved (panned).
    MovePlanting(Vec<MovePlantActionPayload>),
    /// Plantings have been transformation.
    TransformPlanting(Vec<TransformPlantActionPayload>),
    /// The `add_date` field of plantings has been changed.
    UpdatePlantingAddDate(Vec<UpdateAddDateActionPayload>),
    /// The `remove_date` field of plantings has been changed.
    UpdatePlantingRemoveDate(Vec<UpdateRemoveDateActionPayload>),
    /// Note (markdown) of plantings had been changed.
    UpdatePlatingNotes(Vec<UpdatePlantingNoteActionPayload>),
    /// The `additional_name` field of one planting has been changed.
    UpdatePlantingAdditionalName(UpdatePlantingAdditionalNamePayload),

    /// A new base layer image has been created.
    CreateBaseLayerImage(CreateBaseLayerImageActionPayload),
    /// A base layer image has been update.
    UpdateBaseLayerImage(UpdateBaseLayerImageActionPayload),
    /// A base later image has been deleted.
    DeleteBaseLayerImage(DeleteBaseLayerImageActionPayload),

    /// The map geometry has been changed.
    UpdateMapGeometry(UpdateMapGeometryActionPayload),

    /// New drawings have been created.
    CreateDrawing(Vec<DrawingDto>),
    /// Existing drawings have been deleted.
    DeleteDrawing(Vec<Uuid>),
    /// Drawings have been updated.
    UpdateDrawing(Vec<DrawingDto>),
    /// The `add_date` field of drawings has been changed.
    UpdateDrawingAddDate(Vec<DrawingDto>),
    /// The `remove_date` of drawings has changed.
    UpdateDrawingRemoveDate(Vec<DrawingDto>),
}

impl Action {
    #[must_use]
    pub fn new_create_planting_action(
        dtos: &[PlantingDto],
        user_id: Uuid,
        action_id: Uuid,
    ) -> Self {
        Self {
            action_id,
            user_id,
            action: ActionType::CreatePlanting(Vec::from(dtos)),
        }
    }

    #[must_use]
    pub fn new_delete_planting_action(
        dtos: &[DeletePlantingDto],
        user_id: Uuid,
        action_id: Uuid,
    ) -> Self {
        Self {
            action_id,
            user_id,
            action: ActionType::DeletePlanting(
                dtos.iter()
                    .map(|dto| DeletePlantActionPayload { id: dto.id })
                    .collect(),
            ),
        }
    }

    #[must_use]
    pub fn new_move_planting_action(
        dtos: &[MovePlantingDto],
        user_id: Uuid,
        action_id: Uuid,
    ) -> Self {
        Self {
            action_id,
            user_id,
            action: ActionType::MovePlanting(
                dtos.iter()
                    .map(|dto| MovePlantActionPayload {
                        id: dto.id,
                        x: dto.x,
                        y: dto.y,
                    })
                    .collect(),
            ),
        }
    }

    #[must_use]
    pub fn new_transform_planting_action(
        dtos: &[TransformPlantingDto],
        user_id: Uuid,
        action_id: Uuid,
    ) -> Self {
        Self {
            action_id,
            user_id,
            action: ActionType::TransformPlanting(
                dtos.iter()
                    .map(|dto| TransformPlantActionPayload {
                        id: dto.id,
                        x: dto.x,
                        y: dto.y,
                        rotation: dto.rotation,
                        size_x: dto.size_x,
                        size_y: dto.size_y,
                    })
                    .collect(),
            ),
        }
    }

    #[must_use]
    pub fn new_update_planting_add_date_action(
        dtos: &[UpdateAddDatePlantingDto],
        user_id: Uuid,
        action_id: Uuid,
    ) -> Self {
        Self {
            action_id,
            user_id,
            action: ActionType::UpdatePlantingAddDate(
                dtos.iter()
                    .map(|dto| UpdateAddDateActionPayload {
                        id: dto.id,
                        add_date: dto.add_date,
                    })
                    .collect(),
            ),
        }
    }

    #[must_use]
    pub fn new_update_planting_remove_date_action(
        dtos: &[UpdateRemoveDatePlantingDto],
        user_id: Uuid,
        action_id: Uuid,
    ) -> Self {
        Self {
            action_id,
            user_id,
            action: ActionType::UpdatePlantingRemoveDate(
                dtos.iter()
                    .map(|dto| UpdateRemoveDateActionPayload {
                        id: dto.id,
                        remove_date: dto.remove_date,
                    })
                    .collect(),
            ),
        }
    }

    #[must_use]
    pub fn new_update_planting_note_action(
        dtos: &[UpdatePlantingNoteDto],
        user_id: Uuid,
        action_id: Uuid,
    ) -> Self {
        Self {
            action_id,
            user_id,
            action: ActionType::UpdatePlatingNotes(
                dtos.iter()
                    .map(|dto| UpdatePlantingNoteActionPayload {
                        id: dto.id,
                        notes: dto.notes.clone(),
                    })
                    .collect(),
            ),
        }
    }
}

#[typeshare]
#[derive(Debug, Serialize, Clone)]
/// The payload of the [`ActionType::DeletePlanting`].
#[serde(rename_all = "camelCase")]
pub struct DeletePlantActionPayload {
    id: Uuid,
}

#[typeshare]
#[derive(Debug, Serialize, Clone)]
/// The payload of the [`ActionType::MovePlanting`].
#[serde(rename_all = "camelCase")]
pub struct MovePlantActionPayload {
    id: Uuid,
    x: i32,
    y: i32,
}

#[typeshare]
#[derive(Debug, Serialize, Clone)]
/// The payload of the [`ActionType::TransformPlanting`].
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
/// The payload of the [`ActionType::UpdatePlatingNotes`].
#[serde(rename_all = "camelCase")]
pub struct UpdatePlantingNoteActionPayload {
    id: Uuid,
    notes: String,
}

#[typeshare]
#[derive(Debug, Serialize, Clone)]
/// The payload of the [`ActionType::CreateBaseLayerImage`].
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
/// The payload of the [`ActionType::DeleteBaseLayerImage`].
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
/// The payload of the [`ActionType::UpdateBaseLayerImage`].
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
/// The payload of the actions [`ActionType::UpdatePlantingAddDate]`].
#[serde(rename_all = "camelCase")]
pub struct UpdateAddDateActionPayload {
    id: Uuid,
    add_date: Option<NaiveDate>,
}

#[typeshare]
#[derive(Debug, Serialize, Clone)]
/// The payload of the [`ActionType::UpdatePlantingRemoveDate`].
#[serde(rename_all = "camelCase")]
pub struct UpdateRemoveDateActionPayload {
    id: Uuid,
    remove_date: Option<NaiveDate>,
}

#[typeshare]
#[derive(Debug, Serialize, Clone)]
/// The payload of the [`ActionType::UpdateMapGeometry`].
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
/// The payload of the [`ActionType::UpdatePlantingRemoveDate`].
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
