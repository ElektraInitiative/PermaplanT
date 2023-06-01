use super::PlantLayerObjectDto;
use serde::{Deserialize, Serialize};
use typeshare::typeshare;

#[typeshare]
#[derive(Serialize, Deserialize)]
pub struct CreatePlantActionDto {
    #[serde(rename = "type")]
    _type: String,
    #[serde(rename = "userId")]
    user_id: String,
    payload: CreatePlantActionPayload,
}

#[typeshare]
pub type CreatePlantActionPayload = PlantLayerObjectDto;

impl CreatePlantActionDto {
    pub fn new(payload: PlantLayerObjectDto, user_id: String) -> Self {
        Self {
            _type: "CREATE_PLANT".to_string(),
            user_id,
            payload,
        }
    }
}

impl ToString for CreatePlantActionDto {
    fn to_string(&self) -> String {
        serde_json::to_string(&self).expect("Failed to serialize CreatePlantAction")
    }
}

#[typeshare]
#[derive(Serialize, Deserialize)]
pub struct DeletePlantActionDto {
    #[serde(rename = "type")]
    _type: String,
    #[serde(rename = "userId")]
    user_id: String,
    payload: DeletePlantActionPayload,
}

#[typeshare]
#[derive(Serialize, Deserialize)]
pub struct DeletePlantActionPayload {
    id: String,
}

impl DeletePlantActionDto {
    pub fn new(id: String, user_id: String) -> Self {
        Self {
            _type: "DELETE_PLANT".to_string(),
            user_id,
            payload: DeletePlantActionPayload { id },
        }
    }
}

impl ToString for DeletePlantActionDto {
    fn to_string(&self) -> String {
        serde_json::to_string(&self).expect("Failed to serialize DeletePlantAction")
    }
}

#[typeshare]
#[derive(Serialize, Deserialize)]
pub struct MovePlantActionDto {
    #[serde(rename = "type")]
    _type: String,
    #[serde(rename = "userId")]
    user_id: String,
    payload: MovePlantActionPayload,
}

#[typeshare]
#[derive(Serialize, Deserialize)]
pub struct MovePlantActionPayload {
    id: String,
    x: f32,
    y: f32,
}

impl MovePlantActionDto {
    pub fn new(payload: PlantLayerObjectDto, user_id: String) -> Self {
        Self {
            _type: "MOVE_PLANT".to_string(),
            user_id,
            payload: MovePlantActionPayload {
                id: payload.id,
                x: payload.x,
                y: payload.y,
            },
        }
    }
}

impl ToString for MovePlantActionDto {
    fn to_string(&self) -> String {
        serde_json::to_string(&self).expect("Failed to serialize MovePlantActionDto")
    }
}

#[typeshare]
#[derive(Serialize, Deserialize)]
pub struct TransformPlantActionDto {
    #[serde(rename = "type")]
    _type: String,
    #[serde(rename = "userId")]
    user_id: String,
    payload: TransformPlantActionPayload,
}

#[typeshare]
#[derive(Serialize, Deserialize)]
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
    pub fn new(payload: PlantLayerObjectDto, user_id: String) -> Self {
        Self {
            _type: "TRANSFORM_PLANT".to_string(),
            user_id,
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

impl ToString for TransformPlantActionDto {
    fn to_string(&self) -> String {
        serde_json::to_string(&self).expect("Failed to serialize TransformPlantActionPayload")
    }
}
