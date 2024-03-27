//! Core DTO types, like wrappers.
//! Used by other modules of the dto module.

use chrono::NaiveDate;
use serde::{Deserialize, Serialize};
use typeshare::typeshare;
use utoipa::ToSchema;
use uuid::Uuid;

use super::plantings::{DeletePlantingDto, NewPlantingDto, PlantingDto, UpdatePlantingDto};

/// A wrapper for a dto that is used to perform an action.
#[typeshare]
#[derive(Debug, Clone, Serialize, Deserialize, ToSchema)]
#[aliases(
    ActionDtoWrapperNewPlantings = ActionDtoWrapper<Vec<NewPlantingDto>>,
    ActionDtoWrapperUpdatePlantings = ActionDtoWrapper<UpdatePlantingDto>,
    ActionDtoWrapperDeletePlantings = ActionDtoWrapper<Vec<DeletePlantingDto>>,
    ActionDtoWrapperDeleteDrawings = ActionDtoWrapper<Vec<Uuid>>,
)]
#[serde(rename_all = "camelCase")]
pub struct ActionDtoWrapper<T> {
    pub action_id: Uuid,
    pub dto: T,
}

/// A page of results bounded by time.
#[typeshare]
#[derive(Debug, Serialize, Clone, Deserialize, ToSchema)]
#[aliases(
    TimelinePagePlantingsDto = TimelinePage<PlantingDto>,
)]
pub struct TimelinePage<T> {
    /// Resulting records.
    pub results: Vec<T>,
    /// The time frame start date.
    pub from: NaiveDate,
    /// The time frame end date.
    pub to: NaiveDate,
}
