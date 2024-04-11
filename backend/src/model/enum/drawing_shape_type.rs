//! [`DrawingShapeType`] enum.

use diesel_derive_enum::DbEnum;
use serde::{Deserialize, Serialize};
use typeshare::typeshare;
use utoipa::ToSchema;

/// Enum for all possible drawing shapes.
#[typeshare]
#[derive(Serialize, Deserialize, DbEnum, Debug, ToSchema, Clone)]
#[ExistingTypePath = "crate::schema::sql_types::DrawingShapeType"]
pub enum DrawingShapeType {
    #[db_rename = "rectangle"]
    Rectangle,
    #[db_rename = "ellipse"]
    Ellipse,
    #[db_rename = "free line"]
    FreeLine,
    #[db_rename = "bezier polygon"]
    BezierPolygon,
    #[db_rename = "label text"]
    LabelText,
    #[db_rename = "image"]
    Image,
}
