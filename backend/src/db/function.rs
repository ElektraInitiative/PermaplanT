//! Database functions for diesel query-builder.

use diesel::{
    expression::{AsExpression, ValidGrouping},
    pg::Pg,
    query_builder::{AstPass, QueryFragment},
    sql_function,
    sql_types::{Array, Float, Nullable, SqlType, Text},
    AppearsOnTable, Expression, QueryId, QueryResult, SelectableExpression,
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
    ) -> Float
}

sql_function! {
    #[sql_name = "similarity"]
    fn similarity_nullable(
        t1: Nullable<Text>,
        t2: Text
    ) -> Float
}

sql_function! {
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
    fn fuzzy<U>(self, right: U) -> PgTrgmFuzzy<Self, U::Expression>
    where
        Self::SqlType: SqlType,
        U: AsExpression<Self::SqlType>,
    {
        PgTrgmFuzzy::new(self, right.as_expression())
    }
}

impl<T: Expression> PgTrgmExpressionMethods for T {}

/// Used to implement the SQL `AS` operator.
#[derive(Debug, Clone, Copy, QueryId, ValidGrouping)]
pub struct Alias<T> {
    /// Executable query.
    query: T,
    /// The name the column should be renamed to.
    alias: &'static str,
}

impl<T> Expression for Alias<T> {
    type SqlType = Float; // has to be a fixed value as GAT's are not yet stable
}

impl<T, QS> SelectableExpression<QS> for Alias<T> where Self: AppearsOnTable<QS> {}

impl<T, QS> AppearsOnTable<QS> for Alias<T> where Self: Expression {}

/// Use to implement the SQL `AS` operator.
pub trait AliasExpressionMethod: Expression + Sized {
    /// The SQL `AS` operator.
    ///
    /// This implementation is not fully working as the associated type of [`Expression`] would need to be generic.
    /// Currently this implementation always returns [`Float`] when called in a select statement because of this.
    fn alias(self, alias: &'static str) -> Alias<Self> {
        Alias { query: self, alias }
    }
}

impl<T: Expression> AliasExpressionMethod for T {}

impl<T> QueryFragment<Pg> for Alias<T>
where
    T: QueryFragment<Pg>,
{
    fn walk_ast<'b>(&'b self, mut out: AstPass<'_, 'b, Pg>) -> QueryResult<()> {
        self.query.walk_ast(out.reborrow())?;
        out.push_sql(&format!(" AS {}", self.alias));
        Ok(())
    }
}
