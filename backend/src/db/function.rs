//! Database functions for diesel query-builder.

use diesel::{
    expression::AsExpression,
    pg::Pg,
    sql_function,
    sql_types::{Array, Float, Nullable, SqlType, Text},
    Expression,
};

sql_function! {
    /// The SQL function `array_to_string`.
    ///
    /// Used to convert arrays to strings using a delimiter.
    fn array_to_string(
        array: Nullable<Array<Nullable<Text>>>,
        delimiter: Text
    ) -> Text
}

sql_function! {
    /// The `pg_trgm` SQL function `similarity`.
    ///
    /// Used to find how similar two strings are.
    ///
    /// If your column is nullable use [`similarity_nullable()`] instead.
    fn similarity(
        t1: Text,
        t2: Text
    ) -> Float
}

sql_function! {
    /// The `pg_trgm` SQL function `similarity`.
    ///
    /// Used to find how similar two strings are.
    ///
    /// If your column is not nullable use [`similarity()`] instead.
    #[sql_name = "similarity"]
    fn similarity_nullable(
        t1: Nullable<Text>,
        t2: Text
    ) -> Float
}

sql_function! {
    /// The SQL function `greatest`.
    ///
    /// Used to find the greatest value of the inputs.
    fn greatest(
        t1: Float,
        t2: Float,
        t3: Float,
        t4: Float
    ) -> Float
}

diesel::infix_operator!(PgTrgmFuzzy, " % ", backend: Pg);

/// Implements `pg_trgm` methods for diesel
pub trait PgTrgmExpressionMethods
where
    Self: Expression + Sized,
{
    /// Fuzzy search. Uses the `pg_trgm` `%` operator.
    ///
    /// The `%` operator uses the `pg_trgm` function `similarity` in the background with a default value of `0.3`.
    /// <br>
    /// If you want a different value use `similarity` with `gt/lt` instead.
    fn fuzzy<U>(self, right: U) -> PgTrgmFuzzy<Self, U::Expression>
    where
        Self::SqlType: SqlType,
        U: AsExpression<Self::SqlType>,
    {
        PgTrgmFuzzy::new(self, right.as_expression())
    }
}

impl<T: Expression> PgTrgmExpressionMethods for T {}
