//! Contains code to generate `OpenApi` documentation and a `Swagger` endpoint using [`utoipa`] and [`utoipa_swagger_ui`].

use actix_web::web;
use utoipa::OpenApi;
use utoipa_swagger_ui::SwaggerUi;

use crate::{
    controller::{plants, seed},
    model::{
        dto::{NewSeedDto, PlantsDto, SeedDto},
        r#enum::{quality::Quality, quantity::Quantity},
        response::{BodySeed, BodyString, BodyVecPlants, BodyVecSeed},
    },
};

/// Struct used by [`utoipa`] to generate `OpenApi` documentation for all seed endpoints.
#[derive(OpenApi)]
#[openapi(paths(seed::find_all, seed::create, seed::delete_by_id),
        components(
            schemas(
                BodyVecSeed,
                BodySeed,
                BodyString,
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
#[openapi(paths(plants::find_all),
        components(
            schemas(
                BodyVecPlants,
                PlantsDto
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

    cfg.service(SwaggerUi::new("/swagger-ui/{_:.*}").url("/api-doc/openapi.json", openapi));
}
