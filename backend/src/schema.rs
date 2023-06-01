// @generated automatically by Diesel CLI.

pub mod sql_types {
    #[derive(diesel::sql_types::SqlType)]
    #[diesel(postgres_type(name = "deciduous_or_evergreen"))]
    pub struct DeciduousOrEvergreen;

    #[derive(diesel::sql_types::SqlType)]
    #[diesel(postgres_type(name = "external_source"))]
    pub struct ExternalSource;

    #[derive(diesel::sql_types::SqlType)]
    #[diesel(postgres_type(name = "fertility"))]
    pub struct Fertility;

    #[derive(diesel::sql_types::SqlType)]
    #[diesel(postgres_type(name = "flower_type"))]
    pub struct FlowerType;

    #[derive(diesel::sql_types::SqlType)]
    #[diesel(postgres_type(name = "growth_rate"))]
    pub struct GrowthRate;

    #[derive(diesel::sql_types::SqlType)]
    #[diesel(postgres_type(name = "herbaceous_or_woody"))]
    pub struct HerbaceousOrWoody;

    #[derive(diesel::sql_types::SqlType)]
    #[diesel(postgres_type(name = "life_cycle"))]
    pub struct LifeCycle;

    #[derive(diesel::sql_types::SqlType)]
    #[diesel(postgres_type(name = "light_requirement"))]
    pub struct LightRequirement;

    #[derive(diesel::sql_types::SqlType)]
    #[diesel(postgres_type(name = "nutrition_demand"))]
    pub struct NutritionDemand;

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
    #[diesel(postgres_type(name = "shade"))]
    pub struct Shade;

    #[derive(diesel::sql_types::SqlType)]
    #[diesel(postgres_type(name = "soil_ph"))]
    pub struct SoilPh;

    #[derive(diesel::sql_types::SqlType)]
    #[diesel(postgres_type(name = "soil_texture"))]
    pub struct SoilTexture;

    #[derive(diesel::sql_types::SqlType)]
    #[diesel(postgres_type(name = "soil_water_retention"))]
    pub struct SoilWaterRetention;

    #[derive(diesel::sql_types::SqlType)]
    #[diesel(postgres_type(name = "water_requirement"))]
    pub struct WaterRequirement;
}

diesel::table! {
    use postgis_diesel::sql_types::Geography;
    use diesel::sql_types::*;

    map_versions (id) {
        id -> Int4,
        map_id -> Int4,
        version_name -> Text,
        snapshot_date -> Date,
    }
}

diesel::table! {
    use postgis_diesel::sql_types::Geography;
    use diesel::sql_types::*;

    maps (id) {
        id -> Int4,
        name -> Text,
        creation_date -> Date,
        deletion_date -> Nullable<Date>,
        last_visit -> Nullable<Date>,
        is_inactive -> Bool,
        zoom_factor -> Int2,
        honors -> Int2,
        visits -> Int2,
        harvested -> Int2,
        owner_id -> Int4,
        is_private -> Nullable<Bool>,
        description -> Nullable<Text>,
        location -> Nullable<Geography>,
    }
}

diesel::table! {
    use postgis_diesel::sql_types::Geography;
    use diesel::sql_types::*;
    use super::sql_types::Shade;
    use super::sql_types::SoilPh;
    use super::sql_types::SoilTexture;
    use super::sql_types::SoilWaterRetention;
    use super::sql_types::DeciduousOrEvergreen;
    use super::sql_types::HerbaceousOrWoody;
    use super::sql_types::LifeCycle;
    use super::sql_types::GrowthRate;
    use super::sql_types::Fertility;
    use super::sql_types::FlowerType;
    use super::sql_types::NutritionDemand;
    use super::sql_types::LightRequirement;
    use super::sql_types::WaterRequirement;
    use super::sql_types::PropagationMethod;
    use super::sql_types::ExternalSource;

    plants (id) {
        id -> Int4,
        unique_name -> Text,
        common_name_en -> Nullable<Array<Nullable<Text>>>,
        common_name_de -> Nullable<Array<Nullable<Text>>>,
        family -> Nullable<Text>,
        genus -> Nullable<Text>,
        edible_uses_en -> Nullable<Text>,
        medicinal_uses -> Nullable<Text>,
        material_uses_and_functions -> Nullable<Text>,
        botanic -> Nullable<Text>,
        material_uses -> Nullable<Text>,
        functions -> Nullable<Text>,
        heat_zone -> Nullable<Int2>,
        shade -> Nullable<Shade>,
        soil_ph -> Nullable<Array<Nullable<SoilPh>>>,
        soil_texture -> Nullable<Array<Nullable<SoilTexture>>>,
        soil_water_retention -> Nullable<Array<Nullable<SoilWaterRetention>>>,
        environmental_tolerances -> Nullable<Array<Nullable<Text>>>,
        native_geographical_range -> Nullable<Text>,
        native_environment -> Nullable<Text>,
        ecosystem_niche -> Nullable<Text>,
        deciduous_or_evergreen -> Nullable<DeciduousOrEvergreen>,
        herbaceous_or_woody -> Nullable<HerbaceousOrWoody>,
        life_cycle -> Nullable<Array<Nullable<LifeCycle>>>,
        growth_rate -> Nullable<Array<Nullable<GrowthRate>>>,
        height -> Nullable<Text>,
        width -> Nullable<Text>,
        fertility -> Nullable<Array<Nullable<Fertility>>>,
        flower_colour -> Nullable<Text>,
        flower_type -> Nullable<FlowerType>,
        created_at -> Timestamp,
        updated_at -> Timestamp,
        has_drought_tolerance -> Nullable<Bool>,
        tolerates_wind -> Nullable<Bool>,
        plant_references -> Nullable<Array<Nullable<Text>>>,
        is_tree -> Nullable<Bool>,
        nutrition_demand -> Nullable<NutritionDemand>,
        preferable_permaculture_zone -> Nullable<Int2>,
        article_last_modified_at -> Nullable<Timestamp>,
        hardiness_zone -> Nullable<Text>,
        light_requirement -> Nullable<Array<Nullable<LightRequirement>>>,
        water_requirement -> Nullable<Array<Nullable<WaterRequirement>>>,
        propagation_method -> Nullable<Array<Nullable<PropagationMethod>>>,
        alternate_name -> Nullable<Text>,
        diseases -> Nullable<Text>,
        edible -> Nullable<Bool>,
        edible_parts -> Nullable<Array<Nullable<Text>>>,
        germination_temperature -> Nullable<Text>,
        introduced_into -> Nullable<Text>,
        habitus -> Nullable<Text>,
        medicinal_parts -> Nullable<Text>,
        native_to -> Nullable<Text>,
        plants_for_a_future -> Nullable<Text>,
        plants_of_the_world_online_link -> Nullable<Text>,
        plants_of_the_world_online_link_synonym -> Nullable<Text>,
        pollination -> Nullable<Text>,
        propagation_transplanting_en -> Nullable<Text>,
        resistance -> Nullable<Text>,
        root_type -> Nullable<Text>,
        seed_planting_depth_en -> Nullable<Text>,
        seed_viability -> Nullable<Text>,
        slug -> Nullable<Text>,
        spread -> Nullable<Text>,
        utility -> Nullable<Text>,
        warning -> Nullable<Text>,
        when_to_plant_cuttings_en -> Nullable<Text>,
        when_to_plant_division_en -> Nullable<Text>,
        when_to_plant_transplant_en -> Nullable<Text>,
        when_to_sow_indoors_en -> Nullable<Text>,
        sowing_outdoors_en -> Nullable<Text>,
        when_to_start_indoors_weeks -> Nullable<Text>,
        when_to_start_outdoors_weeks -> Nullable<Text>,
        cold_stratification_temperature -> Nullable<Text>,
        cold_stratification_time -> Nullable<Text>,
        days_to_harvest -> Nullable<Text>,
        habitat -> Nullable<Text>,
        spacing_en -> Nullable<Text>,
        wikipedia_url -> Nullable<Text>,
        days_to_maturity -> Nullable<Text>,
        pests -> Nullable<Text>,
        version -> Nullable<Int2>,
        germination_time -> Nullable<Text>,
        description -> Nullable<Text>,
        parent_id -> Nullable<Text>,
        external_source -> Nullable<ExternalSource>,
        external_id -> Nullable<Text>,
        external_url -> Nullable<Text>,
        root_depth -> Nullable<Text>,
        external_article_number -> Nullable<Text>,
        external_portion_content -> Nullable<Text>,
        sowing_outdoors_de -> Nullable<Text>,
        sowing_outdoors -> Nullable<Array<Nullable<Int2>>>,
        harvest_time -> Nullable<Array<Nullable<Int2>>>,
        spacing_de -> Nullable<Text>,
        required_quantity_of_seeds_de -> Nullable<Text>,
        required_quantity_of_seeds_en -> Nullable<Text>,
        seed_planting_depth_de -> Nullable<Text>,
        seed_weight_1000_de -> Nullable<Text>,
        seed_weight_1000_en -> Nullable<Text>,
        seed_weight_1000 -> Nullable<Float8>,
        machine_cultivation_possible -> Nullable<Bool>,
        edible_uses_de -> Nullable<Text>,
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
    }
}

diesel::joinable!(map_versions -> maps (map_id));
diesel::joinable!(seeds -> plants (plant_id));

diesel::allow_tables_to_appear_in_same_query!(map_versions, maps, plants, seeds,);
