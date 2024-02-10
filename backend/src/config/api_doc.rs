//! Contains code to generate `OpenApi` documentation and a `Swagger` endpoint using [`utoipa`] and [`utoipa_swagger_ui`].

use actix_web::web;
use utoipa::{
    openapi::security::{AuthorizationCode, Flow, OAuth2, Scopes, SecurityScheme},
    Modify, OpenApi,
};
use utoipa_swagger_ui::SwaggerUi;

use super::auth::Config;
use crate::{
    controller::{
        base_layer_image, blossoms, config, guided_tours, layers, map, map_collaborators,
        plant_layer, plantings, plants, seed, timeline, users,
    },
    keycloak_api,
    model::{
        dto::{
            core::{
                ActionDtoWrapperDeletePlantings, ActionDtoWrapperNewPlantings,
                ActionDtoWrapperUpdatePlantings, TimelinePagePlantingsDto,
            },
            plantings::{
                MovePlantingDto, NewPlantingDto, PlantingDto, TransformPlantingDto,
                UpdateAddDatePlantingDto, UpdatePlantingDto, UpdatePlantingNoteDto,
                UpdateRemoveDatePlantingDto,
            },
            timeline::{TimelineDto, TimelineEntryDto},
            BaseLayerImageDto, ConfigDto, Coordinates, DeleteMapCollaboratorDto, GainedBlossomsDto,
            GuidedToursDto, LayerDto, MapCollaboratorDto, MapDto, NewLayerDto,
            NewMapCollaboratorDto, NewMapDto, NewSeedDto, PageLayerDto, PageMapDto,
            PagePlantsSummaryDto, PageSeedDto, PlantsSummaryDto, RelationDto, RelationsDto,
            SeedDto, UpdateBaseLayerImageDto, UpdateGuidedToursDto, UpdateMapDto, UsersDto,
        },
        r#enum::{
            experience::Experience, membership::Membership, privacy_option::PrivacyOption,
            quality::Quality, quantity::Quantity, relation_type::RelationType,
            salutation::Salutation,
        },
    },
};

/// Struct used by [`utoipa`] to generate `OpenApi` documentation for all [`config`] endpoints.
#[derive(OpenApi)]
#[openapi(paths(config::get), components(schemas(ConfigDto)))]
struct ConfigApiDoc;

/// Struct used by [`utoipa`] to generate `OpenApi` documentation for all [`seed`] endpoints.
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
    modifiers(&SecurityAddon)
)]
struct SeedApiDoc;

/// Struct used by [`utoipa`] to generate `OpenApi` documentation for all [`plants`] endpoints.
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
    modifiers(&SecurityAddon)
)]
struct PlantsApiDoc;

/// Struct used by [`utoipa`] to generate `OpenApi` documentation for all [`map`] endpoints.
#[derive(OpenApi)]
#[openapi(
    paths(
        map::find,
        map::find_by_id,
        map::create,
        map::update
    ),
    components(
        schemas(
            PageMapDto,
            MapDto,
            NewMapDto,
            UpdateMapDto,
            PrivacyOption,
            Coordinates
        )
    ),
    modifiers(&SecurityAddon)
)]
struct MapApiDoc;

/// Struct used by [`utoipa`] to generate `OpenApi` documentation for all [`layers`] endpoints.
#[derive(OpenApi)]
#[openapi(
    paths(
        layers::find,
        layers::find_by_id,
        layers::create,
        layers::delete
    ),
    components(
        schemas(
            LayerDto,
            NewLayerDto,
            PageLayerDto
        )
    ),
    modifiers(&SecurityAddon)
)]
struct LayerApiDoc;

/// Struct used by [`utoipa`] to generate `OpenApi` documentation for all [`plant_layer`] endpoints.
#[derive(OpenApi)]
#[openapi(
    paths(
        plant_layer::heatmap,
        plant_layer::find_relations
    ),
    components(
        schemas(
            RelationsDto,
            RelationDto,
            RelationType
        )
    ),
    modifiers(&SecurityAddon)
)]
struct PlantLayerApiDoc;

/// Struct used by [`utoipa`] to generate `OpenApi` documentation for all [`base_layer_image`] endpoints.
#[derive(OpenApi)]
#[openapi(
    paths(
        base_layer_image::find,
        base_layer_image::create,
        base_layer_image::update,
        base_layer_image::delete
    ),
    components(
        schemas(
            BaseLayerImageDto,
            UpdateBaseLayerImageDto,
        )
    ),
    modifiers(&SecurityAddon)
)]
struct BaseLayerImagesApiDoc;

/// Struct used by [`utoipa`] to generate `OpenApi` documentation for all [`plantings`] endpoints.
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
            PlantingDto,
            TimelinePagePlantingsDto,
            NewPlantingDto,
            UpdatePlantingDto,
            TransformPlantingDto,
            MovePlantingDto,
            UpdateAddDatePlantingDto,
            UpdateRemoveDatePlantingDto,
            UpdatePlantingNoteDto,
            ActionDtoWrapperNewPlantings,
            ActionDtoWrapperUpdatePlantings,
            ActionDtoWrapperDeletePlantings,
        )
    ),
    modifiers(&SecurityAddon)
)]
struct PlantingsApiDoc;

/// Struct used by [`utoipa`] to generate `OpenApi` documentation for all [`users`] endpoints.
#[derive(OpenApi)]
#[openapi(
    paths(
        users::create,
        users::find
    ),
    components(
        schemas(
            keycloak_api::UserDto,
            UsersDto,
            Experience,
            Membership,
            Salutation
        )
    ),
    modifiers(&SecurityAddon)
)]
struct UsersApiDoc;

/// Struct used by [`utoipa`] to generate `OpenApi` documentation for all [`guided_tours`] endpoints.
#[derive(OpenApi)]
#[openapi(
    paths(
        guided_tours::setup,
        guided_tours::find_by_user,
        guided_tours::update
    ),
    components(
        schemas(
            GuidedToursDto,
            UpdateGuidedToursDto
        )
    ),
    modifiers(&SecurityAddon)
)]
struct GuidedToursApiDoc;

/// Struct used by [`utoipa`] to generate `OpenApi` documentation for all [`blossoms`] endpoints.
#[derive(OpenApi)]
#[openapi(
    paths(
        blossoms::gain,
    ),
    components(
        schemas(
            GainedBlossomsDto
        )
    ),
    modifiers(&SecurityAddon)
)]
struct BlossomsApiDoc;

/// Struct used by [`utoipa`] to generate `OpenApi` documentation for all timeline endpoints.
#[derive(OpenApi)]
#[openapi(
    paths(
        timeline::get_timeline,
    ),
    components(
        schemas(
            TimelineEntryDto,
            TimelineDto
        )
    ),
    modifiers(&SecurityAddon)
)]
struct TimelineApiDoc;

/// Struct used by [`utoipa`] to generate `OpenApi` documentation for all [`map_collaborators`] endpoints.
#[derive(OpenApi)]
#[openapi(
    paths(
        map_collaborators::create,
        map_collaborators::find,
        map_collaborators::delete,
    ),
    components(
        schemas(
            NewMapCollaboratorDto,
            MapCollaboratorDto,
            DeleteMapCollaboratorDto,
        )
    ),
    modifiers(&SecurityAddon)
)]
struct MapCollaboratorsApiDoc;

/// Merges `OpenApi` and then serves it using `Swagger`.
pub fn config(cfg: &mut web::ServiceConfig) {
    let mut openapi = ConfigApiDoc::openapi();
    openapi.merge(SeedApiDoc::openapi());
    openapi.merge(PlantsApiDoc::openapi());
    openapi.merge(MapApiDoc::openapi());
    openapi.merge(LayerApiDoc::openapi());
    openapi.merge(PlantLayerApiDoc::openapi());
    openapi.merge(BaseLayerImagesApiDoc::openapi());
    openapi.merge(PlantingsApiDoc::openapi());
    openapi.merge(UsersApiDoc::openapi());
    openapi.merge(TimelineApiDoc::openapi());
    openapi.merge(GuidedToursApiDoc::openapi());
    openapi.merge(BlossomsApiDoc::openapi());
    openapi.merge(MapCollaboratorsApiDoc::openapi());

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
        let oauth2 = OAuth2::new([Flow::AuthorizationCode(AuthorizationCode::new(
            config.authorization_endpoint.clone(),
            config.token_endpoint.clone(),
            Scopes::new(),
        ))]);
        components.add_security_scheme("oauth2", SecurityScheme::OAuth2(oauth2));
    }
}
