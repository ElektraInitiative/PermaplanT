use diesel_derive_enum::DbEnum;
use serde::{Deserialize, Serialize};
use typeshare::typeshare;
use utoipa::ToSchema;

#[typeshare]
#[derive(Serialize, Deserialize, DbEnum, Debug, ToSchema)]
#[DieselTypePath = "crate::schema::sql_types::NutritionDemand"]
pub enum NutritionDemand {
    LightFeeder,
    ModerateFeeder,
    HeavyFeeder,
}
