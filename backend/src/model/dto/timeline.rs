use chrono::NaiveDate;
use serde::{Deserialize, Serialize};
use std::collections::HashMap;
use typeshare::typeshare;
use utoipa::{IntoParams, ToSchema};

/// One summary datapoint in the timeline, used for a year, month or date
#[typeshare]
#[derive(Debug, Clone, Copy, Serialize, Deserialize, ToSchema, PartialEq, Eq)]
#[serde(rename_all = "camelCase")]
pub struct TimelineEntryDto {
    pub additions: i32,
    pub removals: i32,
}

/// Used to summerize the data necessary for the timeline
#[typeshare]
#[derive(Debug, Clone, Serialize, Deserialize, ToSchema, PartialEq, Eq)]
#[serde(rename_all = "camelCase")]
pub struct TimelineDto {
    #[schema(example = "{ \"2020\": { \"additions\": 7, \"removals\": 7 } }")]
    pub years: HashMap<String, TimelineEntryDto>,
    #[schema(example = "{ \"2020-01\": { \"additions\": 7, \"removals\": 7 } }")]
    pub months: HashMap<String, TimelineEntryDto>,
    #[schema(
        example = "{ \"2020-01-01\": { \"additions\": 3, \"removals\": 2 }, \"2020-01-05\": { \"additions\": 4, \"removals\": 5 } }"
    )]
    pub dates: HashMap<String, TimelineEntryDto>,
}

/// Query parameters for getting the timeline
#[typeshare]
#[derive(Debug, Deserialize, IntoParams)]
#[serde(rename_all = "camelCase")]
pub struct TimelineParameters {
    /// Start date of the timeline
    pub start: NaiveDate,
    /// End date of the timeline
    pub end: NaiveDate,
}
