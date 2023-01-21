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
    posts (id) {
        id -> Int4,
        title -> Varchar,
        body -> Text,
        published -> Bool,
    }
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
        price -> Nullable<Money>,
        generation -> Nullable<Int4>,
        notes -> Nullable<Text>,
    }
}

diesel::table! {
    use diesel::sql_types::*;
    use super::sql_types::Tag;

    varieties (id) {
        id -> Int4,
        tags -> Array<Nullable<Tag>>,
        species -> Varchar,
        variety -> Nullable<Varchar>,
    }
}

diesel::joinable!(seeds -> varieties (variety_id));

diesel::allow_tables_to_appear_in_same_query!(
    posts,
    seeds,
    varieties,
);
