//! Database functions for diesel query-builder.

use diesel::{
    expression::AsExpression,
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

pub trait PgTrgmExpressionMethods
where
    Self: Expression + Sized,
{
    fn fuzzy<U>(self, right: U) -> PgTrgmFuzzy<Self, U::Expression>
    where
        Self::SqlType: SqlType,
        U: AsExpression<Self::SqlType>,
    {
        PgTrgmFuzzy::new(self, right.as_expression())
    }
}

impl<T: Expression> PgTrgmExpressionMethods for T {}
