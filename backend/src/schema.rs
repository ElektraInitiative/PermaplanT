// @generated automatically by Diesel CLI.

diesel::table! {
    seeds (id) {
        id -> Int4,
        tags -> Array<Nullable<Text>>,
        name -> Varchar,
        variety_id -> Int4,
        harvest_year -> Int2,
        use_by -> Nullable<Date>,
        origin -> Nullable<Varchar>,
        taste -> Nullable<Varchar>,
        #[sql_name = "yield"]
        yield_ -> Nullable<Varchar>,
        quantity -> Varchar,
        quality -> Nullable<Varchar>,
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
