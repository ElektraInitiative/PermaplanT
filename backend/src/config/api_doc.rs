//! Contains code to generate `OpenApi` documentation and a `Swagger` endpoint using [`utoipa`] and [`utoipa_swagger_ui`].

use actix_web::web;
use utoipa::OpenApi;
use utoipa_swagger_ui::SwaggerUi;

use crate::model::dto::Page;
use crate::{
    controller::{plants, seed},
    model::{
        dto::{NewSeedDto, PlantsSummaryDto, SeedDto},
        r#enum::{quality::Quality, quantity::Quantity},
    },
};

/// Struct used by [`utoipa`] to generate `OpenApi` documentation for all seed endpoints.
#[derive(OpenApi)]
#[openapi(paths(seed::find, seed::create, seed::delete_by_id),
        components(
            schemas(
                SeedDto,
                NewSeedDto,
                Quality,
                Quantity)
        ),
        tags(
            (name = "seed")
        )
    )]
struct SeedApiDoc;

/// Struct used by [`utoipa`] to generate `OpenApi` documentation for all plant endpoints.
#[derive(OpenApi)]
#[openapi(paths(plants::find),
        components(
            schemas(
                Page<PlantsSummaryDto>
            )
        ),
        tags(
            (name = "plants")
        )
    )]
struct PlantsApiDoc;

/// Merges `OpenApi` and then serves it using `Swagger`.
pub fn config(cfg: &mut web::ServiceConfig) {
    let mut openapi = SeedApiDoc::openapi();
    openapi.merge(PlantsApiDoc::openapi());

    cfg.service(SwaggerUi::new("/doc/api/swagger/ui/{_:.*}").url("/doc/api/openapi.json", openapi));
}
