use super::PlantingDto;
use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize)]
pub struct CreatePlantAction {
    #[serde(rename = "type")]
    _type: String,
    payload: PlantingDto,
}

impl CreatePlantAction {
    pub fn new(payload: PlantingDto) -> Self {
        Self {
            _type: "CREATE_PLANT".to_string(),
            payload,
        }
    }
}

impl ToString for CreatePlantAction {
    fn to_string(&self) -> String {
        serde_json::to_string(&self).expect("Failed to serialize CreatePlantAction")
    }
}

#[derive(Serialize, Deserialize)]
pub struct DeletePlantAction {
    #[serde(rename = "type")]
    _type: String,
    payload: DeletePlantActionPayload,
}
#[derive(Serialize, Deserialize)]
pub struct DeletePlantActionPayload {
    id: String,
}

impl DeletePlantAction {
    pub fn new(id: String) -> Self {
        Self {
            _type: "DELETE_PLANT".to_string(),
            payload: DeletePlantActionPayload { id },
        }
    }
}

impl ToString for DeletePlantAction {
    fn to_string(&self) -> String {
        serde_json::to_string(&self).expect("Failed to serialize DeletePlantAction")
    }
}
