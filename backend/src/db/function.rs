//! Database functions for diesel query-builder.

use diesel::{
    expression::{AsExpression, TypedExpressionType},
    pg::Pg,
    sql_function,
    sql_types::{Array, Nullable, SqlType, Text},
    Expression,
};

sql_function! {
    fn array_to_string(
        array: Nullable<Array<Nullable<Text>>>,
        delimiter: Text
    ) -> Text
}

diesel::infix_operator!(PgTrgmFuzzy, " % ", backend: Pg);

pub fn fuzzy<T, U, ST>(left: T, right: U) -> PgTrgmFuzzy<T, U::Expression>
where
    T: Expression<SqlType = ST>,
    U: AsExpression<ST>,
    ST: SqlType + TypedExpressionType,
{
    PgTrgmFuzzy::new(left, right.as_expression())
}
