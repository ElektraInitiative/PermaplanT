// @generated automatically by Diesel CLI.

pub mod sql_types {
    #[derive(diesel::sql_types::SqlType)]
    #[diesel(postgres_type(name = "deciduous_or_evergreen"))]
    pub struct DeciduousOrEvergreen;

    #[derive(diesel::sql_types::SqlType)]
    #[diesel(postgres_type(name = "experience"))]
    pub struct Experience;

    #[derive(diesel::sql_types::SqlType)]
    #[diesel(postgres_type(name = "external_source"))]
    pub struct ExternalSource;

    #[derive(diesel::sql_types::SqlType)]
    #[diesel(postgres_type(name = "fertility"))]
    pub struct Fertility;

    #[derive(diesel::sql_types::SqlType)]
    #[diesel(postgres_type(name = "geography"))]
    pub struct Geography;

    #[derive(diesel::sql_types::SqlType)]
    #[diesel(postgres_type(name = "geometry"))]
    pub struct Geometry;

    #[derive(diesel::sql_types::SqlType)]
    #[diesel(postgres_type(name = "growth_rate"))]
    pub struct GrowthRate;

    #[derive(diesel::sql_types::SqlType)]
    #[diesel(postgres_type(name = "herbaceous_or_woody"))]
    pub struct HerbaceousOrWoody;

    #[derive(diesel::sql_types::SqlType)]
    #[diesel(postgres_type(name = "layer_type"))]
    pub struct LayerType;

    #[derive(diesel::sql_types::SqlType)]
    #[diesel(postgres_type(name = "life_cycle"))]
    pub struct LifeCycle;

    #[derive(diesel::sql_types::SqlType)]
    #[diesel(postgres_type(name = "light_requirement"))]
    pub struct LightRequirement;

    #[derive(diesel::sql_types::SqlType)]
    #[diesel(postgres_type(name = "membership"))]
    pub struct Membership;

    #[derive(diesel::sql_types::SqlType)]
    #[diesel(postgres_type(name = "plant_height"))]
    pub struct PlantHeight;

    #[derive(diesel::sql_types::SqlType)]
    #[diesel(postgres_type(name = "plant_spread"))]
    pub struct PlantSpread;

    #[derive(diesel::sql_types::SqlType)]
    #[diesel(postgres_type(name = "privacy_option"))]
    pub struct PrivacyOption;

    #[derive(diesel::sql_types::SqlType)]
    #[diesel(postgres_type(name = "propagation_method"))]
    pub struct PropagationMethod;

    #[derive(diesel::sql_types::SqlType)]
    #[diesel(postgres_type(name = "quality"))]
    pub struct Quality;

    #[derive(diesel::sql_types::SqlType)]
    #[diesel(postgres_type(name = "quantity"))]
    pub struct Quantity;

    #[derive(diesel::sql_types::SqlType)]
    #[diesel(postgres_type(name = "relation_type"))]
    pub struct RelationType;

    #[derive(diesel::sql_types::SqlType)]
    #[diesel(postgres_type(name = "salutation"))]
    pub struct Salutation;

    #[derive(diesel::sql_types::SqlType)]
    #[diesel(postgres_type(name = "shade"))]
    pub struct Shade;

    #[derive(diesel::sql_types::SqlType)]
    #[diesel(postgres_type(name = "soil_ph"))]
    pub struct SoilPh;

    #[derive(diesel::sql_types::SqlType)]
    #[diesel(postgres_type(name = "soil_texture"))]
    pub struct SoilTexture;

    #[derive(diesel::sql_types::SqlType)]
    #[diesel(postgres_type(name = "track"))]
    pub struct Track;

    #[derive(diesel::sql_types::SqlType)]
    #[diesel(postgres_type(name = "water_requirement"))]
    pub struct WaterRequirement;
}

diesel::table! {
    use postgis_diesel::sql_types::Geography;
    use diesel::sql_types::*;

    base_layer_images (id) {
        id -> Uuid,
        layer_id -> Int4,
        path -> Text,
        rotation -> Float4,
        scale -> Float4,
    }
}

diesel::table! {
    use postgis_diesel::sql_types::Geography;
    use diesel::sql_types::*;
    use super::sql_types::Track;

    blossoms (title) {
        title -> Text,
        description -> Nullable<Text>,
        track -> Nullable<Track>,
        icon -> Nullable<Text>,
        is_seasonal -> Bool,
    }
}

diesel::table! {
    use postgis_diesel::sql_types::Geography;
    use diesel::sql_types::*;

    gained_blossoms (user_id, blossom) {
        user_id -> Uuid,
        blossom -> Text,
        times_gained -> Int4,
        gained_date -> Date,
    }
}

diesel::table! {
    use postgis_diesel::sql_types::Geography;
    use diesel::sql_types::*;

    guided_tours (user_id) {
        user_id -> Uuid,
        editor_tour_completed -> Bool,
    }
}

diesel::table! {
    use postgis_diesel::sql_types::Geography;
    use diesel::sql_types::*;
    use super::sql_types::LayerType;

    layers (id) {
        id -> Int4,
        map_id -> Int4,
        #[sql_name = "type"]
        type_ -> LayerType,
        name -> Text,
        is_alternative -> Bool,
    }
}

diesel::table! {
    use postgis_diesel::sql_types::Geography;
    use diesel::sql_types::*;
    use super::sql_types::PrivacyOption;
    use super::sql_types::Geography;
    use super::sql_types::Geometry;

    maps (id) {
        id -> Int4,
        name -> Text,
        deletion_date -> Nullable<Date>,
        last_visit -> Nullable<Date>,
        is_inactive -> Bool,
        zoom_factor -> Int2,
        honors -> Int2,
        visits -> Int2,
        harvested -> Int2,
        privacy -> PrivacyOption,
        description -> Nullable<Text>,
        location -> Nullable<Geography>,
        created_by -> Uuid,
        geometry -> Geometry,
        created_at -> Timestamp,
        modified_at -> Timestamp,
        modified_by -> Uuid,
    }
}

diesel::table! {
    use postgis_diesel::sql_types::Geography;
    use diesel::sql_types::*;

    plantings (id) {
        id -> Uuid,
        layer_id -> Int4,
        plant_id -> Int4,
        x -> Int4,
        y -> Int4,
        width -> Int4,
        height -> Int4,
        rotation -> Float4,
        scale_x -> Float4,
        scale_y -> Float4,
        add_date -> Nullable<Date>,
        remove_date -> Nullable<Date>,
        seed_id -> Nullable<Int4>,
        is_area -> Bool,
        notes -> Text,
        created_at -> Timestamp,
        modified_at -> Timestamp,
        created_by -> Uuid,
        modified_by -> Uuid,
    }
}

diesel::table! {
    use postgis_diesel::sql_types::Geography;
    use diesel::sql_types::*;
    use super::sql_types::Shade;
    use super::sql_types::SoilPh;
    use super::sql_types::SoilTexture;
    use super::sql_types::DeciduousOrEvergreen;
    use super::sql_types::HerbaceousOrWoody;
    use super::sql_types::LifeCycle;
    use super::sql_types::GrowthRate;
    use super::sql_types::PlantHeight;
    use super::sql_types::Fertility;
    use super::sql_types::LightRequirement;
    use super::sql_types::WaterRequirement;
    use super::sql_types::PropagationMethod;
    use super::sql_types::PlantSpread;
    use super::sql_types::ExternalSource;

    plants (id) {
        id -> Int4,
        unique_name -> Text,
        common_name_en -> Nullable<Array<Nullable<Text>>>,
        common_name_de -> Nullable<Array<Nullable<Text>>>,
        family -> Nullable<Text>,
        edible_uses_en -> Nullable<Text>,
        functions -> Nullable<Text>,
        heat_zone -> Nullable<Int2>,
        shade -> Nullable<Shade>,
        soil_ph -> Nullable<Array<Nullable<SoilPh>>>,
        soil_texture -> Nullable<Array<Nullable<SoilTexture>>>,
        ecosystem_niche -> Nullable<Text>,
        deciduous_or_evergreen -> Nullable<DeciduousOrEvergreen>,
        herbaceous_or_woody -> Nullable<HerbaceousOrWoody>,
        life_cycle -> Nullable<Array<Nullable<LifeCycle>>>,
        growth_rate -> Nullable<Array<Nullable<GrowthRate>>>,
        height -> Nullable<PlantHeight>,
        fertility -> Nullable<Array<Nullable<Fertility>>>,
        created_at -> Timestamp,
        updated_at -> Timestamp,
        has_drought_tolerance -> Nullable<Bool>,
        tolerates_wind -> Nullable<Bool>,
        preferable_permaculture_zone -> Nullable<Int2>,
        hardiness_zone -> Nullable<Text>,
        light_requirement -> Nullable<Array<Nullable<LightRequirement>>>,
        water_requirement -> Nullable<Array<Nullable<WaterRequirement>>>,
        propagation_method -> Nullable<Array<Nullable<PropagationMethod>>>,
        alternate_name -> Nullable<Text>,
        edible -> Nullable<Bool>,
        edible_parts -> Nullable<Array<Nullable<Text>>>,
        spread -> Nullable<PlantSpread>,
        warning -> Nullable<Text>,
        version -> Nullable<Int2>,
        external_source -> Nullable<ExternalSource>,
        sowing_outdoors -> Nullable<Array<Nullable<Int2>>>,
        harvest_time -> Nullable<Array<Nullable<Int2>>>,
        seed_weight_1000 -> Nullable<Float8>,
    }
}

diesel::table! {
    use postgis_diesel::sql_types::Geography;
    use diesel::sql_types::*;
    use super::sql_types::RelationType;

    relations (plant1, plant2) {
        plant1 -> Int4,
        plant2 -> Int4,
        relation -> RelationType,
        note -> Nullable<Text>,
    }
}

diesel::table! {
    use postgis_diesel::sql_types::Geography;
    use diesel::sql_types::*;
    use super::sql_types::Quantity;
    use super::sql_types::Quality;

    seeds (id) {
        id -> Int4,
        name -> Text,
        harvest_year -> Int2,
        use_by -> Nullable<Date>,
        origin -> Nullable<Text>,
        taste -> Nullable<Text>,
        #[sql_name = "yield"]
        yield_ -> Nullable<Text>,
        quantity -> Quantity,
        quality -> Nullable<Quality>,
        price -> Nullable<Int2>,
        generation -> Nullable<Int2>,
        notes -> Nullable<Text>,
        variety -> Nullable<Text>,
        plant_id -> Nullable<Int4>,
        created_by -> Uuid,
        archived_at -> Nullable<Timestamp>,
    }
}

diesel::table! {
    use postgis_diesel::sql_types::Geography;
    use diesel::sql_types::*;
    use super::sql_types::Salutation;
    use super::sql_types::Experience;
    use super::sql_types::Membership;

    users (id) {
        id -> Uuid,
        salutation -> Salutation,
        title -> Nullable<Text>,
        country -> Text,
        phone -> Nullable<Text>,
        website -> Nullable<Text>,
        organization -> Nullable<Text>,
        experience -> Nullable<Experience>,
        membership -> Nullable<Membership>,
        member_years -> Nullable<Array<Nullable<Int4>>>,
        member_since -> Nullable<Date>,
        permacoins -> Nullable<Array<Nullable<Int4>>>,
    }
}

diesel::joinable!(base_layer_images -> layers (layer_id));
diesel::joinable!(layers -> maps (map_id));
diesel::joinable!(plantings -> layers (layer_id));
diesel::joinable!(plantings -> plants (plant_id));
diesel::joinable!(plantings -> seeds (seed_id));
diesel::joinable!(seeds -> plants (plant_id));

diesel::allow_tables_to_appear_in_same_query!(
    base_layer_images,
    blossoms,
    gained_blossoms,
    guided_tours,
    layers,
    maps,
    plantings,
    plants,
    relations,
    seeds,
    users,
);
