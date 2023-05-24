//! Database functions for diesel query-builder.

use diesel::{
    sql_function,
    sql_types::{Array, Nullable, Text},
};

sql_function! {
    fn array_to_string(
        array: Nullable<Array<Nullable<Text>>>,
        delimiter: Text
    ) -> Text
}

// TODO: maybe a version that excepts arbitrarily many is possible
sql_function! {
    fn greatest(
        t1: Text,
        t2: Text,
        t3: Text,
        t4: Text
    ) -> Float
}

sql_function! {
    fn similarity(
        column: Text,
        query: Text
    ) -> Text
}
