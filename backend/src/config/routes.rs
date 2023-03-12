//! Routes in the backend.

use actix_web::{middleware::NormalizePath, web};
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

/// Defines all routes of the backend and which functions they map to.
pub fn config(cfg: &mut web::ServiceConfig) {
    cfg.service(
        web::scope("/api")
            .service(
                web::scope("/seeds")
                    .service(seed::find_all)
                    .service(seed::create)
                    .service(seed::delete_by_id),
            )
            .service(web::scope("/plants").service(plants::find_all))
            .wrap(NormalizePath::default()),
    );
}

/// Creates a swagger doc endpoint
pub fn api_doc(cfg: &mut web::ServiceConfig) {
    /// Struct used by utoipa to generate seeds-api-doc
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

    /// Struct used by utoipa to generate plants-api-doc
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

    let mut openapi = SeedApiDoc::openapi();
    openapi.merge(PlantsApiDoc::openapi());

    cfg.service(SwaggerUi::new("/swagger-ui/{_:.*}").url("/api-doc/openapi.json", openapi));
}
