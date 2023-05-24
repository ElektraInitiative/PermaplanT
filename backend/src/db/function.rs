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

sql_function! {
    fn similarity(
        t1: Text,
        t2: Text
    ) -> Text
}

sql_function! {
    fn similarity_nullable(
        t1: Nullable<Text>,
        t2: Text
    ) -> Text
}

sql_function! {
    fn greatest(
        t1: Text,
        t2: Text,
        t3: Text,
        t4: Text
    ) -> Text
}

diesel::infix_operator!(PgTrgmFuzzy, " % ", backend: Pg);
diesel::infix_operator!(Alias, " AS ");

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

    fn alias<U>(self, right: U) -> Alias<Self, U::Expression>
    where
        Self::SqlType: SqlType,
        U: AsExpression<Self::SqlType>,
    {
        Alias::new(self, right.as_expression())
    }
}

impl<T: Expression> PgTrgmExpressionMethods for T {}
