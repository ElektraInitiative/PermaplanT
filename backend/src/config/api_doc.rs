//! Contains code to generate `OpenApi` documentation and a `Swagger` endpoint using [`utoipa`] and [`utoipa_swagger_ui`].

use actix_web::web;
use utoipa::{
    openapi::security::{AuthorizationCode, Flow, OAuth2, Password, Scopes, SecurityScheme},
    Modify, OpenApi,
};
use utoipa_swagger_ui::SwaggerUi;

use super::auth::Config;
use crate::{
    controller::{config, map, plantings, plants, seed},
    model::{
        dto::{
            plantings::{NewPlantingDto, PlantingDto, UpdatePlantingDto},
            ConfigDto, MapDto, NewMapDto, NewSeedDto, PageMapDto, PagePlantingDto,
            PagePlantsSummaryDto, PageSeedDto, PlantsSummaryDto, SeedDto,
        },
        r#enum::{quality::Quality, quantity::Quantity},
    },
};

/// Struct used by [`utoipa`] to generate `OpenApi` documentation for all config endpoints.
#[derive(OpenApi)]
#[openapi(
    paths(
        config::get
    ),
    components(
        schemas(
            ConfigDto
        )
    ),
    tags((name = "config"))
)]
struct ConfigApiDoc;

/// Struct used by [`utoipa`] to generate `OpenApi` documentation for all seed endpoints.
#[derive(OpenApi)]
#[openapi(
    paths(
        seed::find,
        seed::find_by_id,
        seed::create,
        seed::delete_by_id
    ),
    components(
        schemas(
            PageSeedDto,
            SeedDto,
            NewSeedDto,
            Quality,
            Quantity
        )
    ),
    tags((name = "seed")),
    modifiers(&SecurityAddon)
)]
struct SeedApiDoc;

/// Struct used by [`utoipa`] to generate `OpenApi` documentation for all plant endpoints.
#[derive(OpenApi)]
#[openapi(
    paths(
        plants::find,
        plants::find_by_id
    ),
    components(
        schemas(
            PagePlantsSummaryDto,
            PlantsSummaryDto
        )
    ),
    tags((name = "plants")),
    modifiers(&SecurityAddon)
)]
struct PlantsApiDoc;

/// Struct used by [`utoipa`] to generate `OpenApi` documentation for all plantings endpoints.
#[derive(OpenApi)]
#[openapi(
    paths(
        plantings::find,
        plantings::create,
        plantings::update,
        plantings::delete
    ),
    components(
        schemas(
            NewPlantingDto,
            PlantingDto,
            UpdatePlantingDto,
            PagePlantingDto
        )
    ),
    tags((name = "plantings")),
    modifiers(&SecurityAddon)
)]
struct PlantingsApiDoc;

/// Struct used by [`utoipa`] to generate `OpenApi` documentation for all map endpoints.
#[derive(OpenApi)]
#[openapi(
    paths(
        map::find,
        map::find_by_id,
        map::create
    ),
    components(
        schemas(
            PageMapDto,
            MapDto,
            NewMapDto,
        )
    ),
    tags((name = "map")),
    modifiers(&SecurityAddon)
)]
struct MapApiDoc;

/// Merges `OpenApi` and then serves it using `Swagger`.
pub fn config(cfg: &mut web::ServiceConfig) {
    let mut openapi = ConfigApiDoc::openapi();
    openapi.merge(SeedApiDoc::openapi());
    openapi.merge(PlantsApiDoc::openapi());
    openapi.merge(PlantingsApiDoc::openapi());
    openapi.merge(MapApiDoc::openapi());

    cfg.service(SwaggerUi::new("/doc/api/swagger/ui/{_:.*}").url("/doc/api/openapi.json", openapi));
}

/// Used by [`utoipa`] for `OAuth2`.
struct SecurityAddon;

impl Modify for SecurityAddon {
    fn modify(&self, openapi: &mut utoipa::openapi::OpenApi) {
        // We can unwrap safely since there already is components registered.
        #[allow(clippy::unwrap_used)]
        let components = openapi.components.as_mut().unwrap();

        let config = &Config::get().openid_configuration;
        let oauth2 = OAuth2::new([
            Flow::AuthorizationCode(AuthorizationCode::new(
                config.authorization_endpoint.clone(),
                config.token_endpoint.clone(),
                Scopes::new(),
            )),
            Flow::Password(Password::new(config.token_endpoint.clone(), Scopes::new())),
        ]);
        components.add_security_scheme("oauth2", SecurityScheme::OAuth2(oauth2));
    }
}
