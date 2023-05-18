//! Contains code to generate `OpenApi` documentation and a `Swagger` endpoint using [`utoipa`] and [`utoipa_swagger_ui`].

use actix_web::web;
use utoipa::OpenApi;
use utoipa_swagger_ui::SwaggerUi;

use crate::{
    controller::{base_layers, plantings, plants, seed},
    model::{
        dto::{
            BaseLayerDto, NewBaseLayerDto, NewPlantingDto, NewSeedDto, PagePlantingDto,
            PagePlantsSummaryDto, PageSeedDto, PlantingDto, PlantsSummaryDto, SeedDto,
            UpdatePlantingDto,
        },
        r#enum::{quality::Quality, quantity::Quantity},
    },
};

/// Struct used by [`utoipa`] to generate `OpenApi` documentation for all seed endpoints.
#[derive(OpenApi)]
#[openapi(paths(seed::find, seed::create, seed::delete_by_id),
        components(
            schemas(
                PageSeedDto,
                SeedDto,
                NewSeedDto,
                Quality,
                Quantity
            )
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
                PagePlantsSummaryDto,
                PlantsSummaryDto
            )
        ),
        tags(
            (name = "plants")
        )
    )]
struct PlantsApiDoc;

/// Struct used by [`utoipa`] to generate `OpenApi` documentation for all planting endpoints.
#[derive(OpenApi)]
#[openapi(paths(plantings::find, plantings::create, plantings::update, plantings::delete),
    components(
        schemas(
            NewPlantingDto,
            PlantingDto,
            UpdatePlantingDto,
            PagePlantingDto
        )
    ),
    tags(
        (name = "plantings")
    )
)]
struct PlantingsApiDoc;

/// Struct used by [`utoipa`] to generate `OpenApi` documentation for all base layer endpoints.
#[derive(OpenApi)]
#[openapi(paths(base_layers::find_by_id, plantings::create, plantings::delete),
    components(
        schemas(
            NewBaseLayerDto,
            BaseLayerDto,
        )
    ),
    tags(
        (name = "layers")
    )
)]
struct BaseLayersApiDoc;

/// Merges `OpenApi` and then serves it using `Swagger`.
pub fn config(cfg: &mut web::ServiceConfig) {
    let mut openapi = SeedApiDoc::openapi();
    openapi.merge(PlantsApiDoc::openapi());
    openapi.merge(PlantingsApiDoc::openapi());

    cfg.service(SwaggerUi::new("/doc/api/swagger/ui/{_:.*}").url("/doc/api/openapi.json", openapi));
}
