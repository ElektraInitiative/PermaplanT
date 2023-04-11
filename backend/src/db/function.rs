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
