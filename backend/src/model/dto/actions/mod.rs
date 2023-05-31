use std::fmt::Display;

use super::PlantLayerObjectDto;
use serde::{ser, Deserialize, Serialize};
use typeshare::typeshare;

#[typeshare]
#[derive(Serialize, Deserialize)]
pub struct CreatePlantAction {
    #[serde(rename = "type")]
    _type: String,
    #[serde(rename = "userId")]
    user_id: String,
    payload: CreatePlantActionPayload,
}

#[typeshare]
pub type CreatePlantActionPayload = PlantLayerObjectDto;

impl CreatePlantAction {
    pub fn new(payload: PlantLayerObjectDto, user_id: String) -> Self {
        Self {
            _type: "CREATE_PLANT".to_string(),
            user_id,
            payload,
        }
    }
}

impl ToString for CreatePlantAction {
    fn to_string(&self) -> String {
        serde_json::to_string(&self).expect("Failed to serialize CreatePlantAction")
    }
}

#[typeshare]
#[derive(Serialize, Deserialize)]
pub struct DeletePlantAction {
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

impl DeletePlantAction {
    pub fn new(id: String, user_id: String) -> Self {
        Self {
            _type: "DELETE_PLANT".to_string(),
            user_id,
            payload: DeletePlantActionPayload { id },
        }
    }
}

impl ToString for DeletePlantAction {
    fn to_string(&self) -> String {
        serde_json::to_string(&self).expect("Failed to serialize DeletePlantAction")
    }
}
