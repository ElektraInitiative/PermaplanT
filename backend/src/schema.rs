// @generated automatically by Diesel CLI.

pub mod sql_types {
    #[derive(diesel::sql_types::SqlType)]
    #[diesel(postgres_type(name = "quality"))]
    pub struct Quality;

    #[derive(diesel::sql_types::SqlType)]
    #[diesel(postgres_type(name = "quantity"))]
    pub struct Quantity;

    #[derive(diesel::sql_types::SqlType)]
    #[diesel(postgres_type(name = "tag"))]
    pub struct Tag;
}

diesel::table! {
    use diesel::sql_types::*;
    use super::sql_types::Tag;
    use super::sql_types::Quantity;
    use super::sql_types::Quality;

    seeds (id) {
        id -> Int4,
        tags -> Array<Nullable<Tag>>,
        name -> Varchar,
        variety_id -> Int4,
        harvest_year -> Int2,
        use_by -> Nullable<Date>,
        origin -> Nullable<Varchar>,
        taste -> Nullable<Varchar>,
        #[sql_name = "yield"]
        yield_ -> Nullable<Varchar>,
        quantity -> Quantity,
        quality -> Nullable<Quality>,
        price -> Nullable<Int2>,
        generation -> Nullable<Int2>,
        notes -> Nullable<Text>,
    }
}

diesel::table! {
    varieties (id) {
        id -> Int4,
        tags -> Array<Nullable<Text>>,
        species -> Varchar,
        variety -> Nullable<Varchar>,
    }
}

diesel::joinable!(seeds -> varieties (variety_id));

diesel::allow_tables_to_appear_in_same_query!(
    seeds,
    varieties,
);
