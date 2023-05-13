//! Contains code to generate `OpenApi` documentation and a `Swagger` endpoint using [`utoipa`] and [`utoipa_swagger_ui`].

use actix_web::web;
use utoipa::{
    openapi::security::{AuthorizationCode, Flow, OAuth2, Password, Scopes, SecurityScheme},
    Modify, OpenApi,
};
use utoipa_swagger_ui::SwaggerUi;

use crate::{
    controller::{plantings, plants, seed},
    model::{
        dto::{
            NewPlantingDto, NewSeedDto, PagePlantingDto, PagePlantsSummaryDto, PageSeedDto,
            PlantingDto, PlantsSummaryDto, SeedDto, UpdatePlantingDto,
        },
        r#enum::{quality::Quality, quantity::Quantity},
    },
};

#[cfg(feature = "auth")]
use super::auth::Config;

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
        ),
        modifiers(&SecurityAddon),
        security(
            ("oauth2" = [])
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
        ),
        modifiers(&SecurityAddon),
        security(
            ("oauth2" = [])
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
    ),
    modifiers(&SecurityAddon),
    security(
        ("oauth2" = [])
    )
)]
struct PlantingsApiDoc;

/// Merges `OpenApi` and then serves it using `Swagger`.
pub fn config(cfg: &mut web::ServiceConfig) {
    let mut openapi = SeedApiDoc::openapi();
    openapi.merge(PlantsApiDoc::openapi());
    openapi.merge(PlantingsApiDoc::openapi());

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
