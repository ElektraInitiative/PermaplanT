//! Paginate queries.

use crate::model::dto::Page;
use diesel::pg::Pg;
use diesel::query_builder::{AstPass, Query, QueryFragment};
use diesel::sql_types::{BigInt, Integer};
use diesel::{QueryId, QueryResult};
use diesel_async::methods::LoadQuery;
use diesel_async::{AsyncPgConnection, RunQueryDsl};
use std::cmp::max;

/// The default number of rows returned from a paginated query.
pub const DEFAULT_PER_PAGE: i32 = 10;
/// The minimum value for page number in a paginated query.
/// Pages start at 1. Using a lower value would lead to nonsensical queries.
pub const MIN_PAGE: i32 = 1;
/// The minimum number of rows returned from a paginated query.
pub const MIN_PER_PAGE: i32 = 1;

/// An executable paginated query.
#[derive(Debug, Clone, Copy, QueryId)]
pub struct PaginatedQuery<T> {
    /// Executable query.
    query: T,
    /// Page number to be loaded.
    page: i32,
    /// Number of rows loaded in the query.
    per_page: i32,
    /// Offset to the the first row in the query.
    offset: i32,
}

/// A trait intended for enabling pagination in diesel's query builder.
pub trait Paginate: Sized {
    /// Return a paginated version of a query for a specific page number.
    fn paginate(self, page: Option<i32>) -> PaginatedQuery<Self>;
}

impl<T> Paginate for T {
    fn paginate(self, page: Option<i32>) -> PaginatedQuery<Self> {
        // allow optional pages and disallow non positive pages
        let actual_page = max(page.unwrap_or(MIN_PAGE), MIN_PAGE);
        PaginatedQuery {
            query: self,
            per_page: DEFAULT_PER_PAGE,
            page: actual_page,
            offset: (actual_page - 1) * DEFAULT_PER_PAGE,
        }
    }
}

impl<T> PaginatedQuery<T> {
    /// Set the number of rows returned by the query.
    #[must_use]
    pub fn per_page(self, per_page: Option<i32>) -> Self {
        // allow optional per_page and disallow non positive per_page
        let actual_per_page = max(per_page.unwrap_or(DEFAULT_PER_PAGE), MIN_PER_PAGE);
        Self {
            per_page: actual_per_page,
            offset: (self.page - 1) * actual_per_page,
            ..self
        }
    }

    /// Execute the query returning one [`Page`] of rows.
    ///
    /// # Errors
    /// Unknown, diesel doesn't say why it might error.
    pub async fn load_page<'query, 'conn, U>(
        self,
        conn: &'conn mut AsyncPgConnection,
    ) -> QueryResult<Page<U>>
    where
        T: Send,
        U: Send,
        Self: LoadQuery<'query, AsyncPgConnection, (U, i64)> + 'query,
    {
        let page = self.page;
        let per_page = self.per_page;
        let query_result = self.load::<(U, i64)>(conn).await?;
        let total = query_result.get(0).map_or(0, |x| x.1);
        let results = query_result.into_iter().map(|x| x.0).collect();
        let extra_page = match total % i64::from(per_page) {
            0 => 0,
            _ => 1,
        };
        #[allow(clippy::cast_possible_truncation, clippy::integer_division)]
        let total_pages = (total / i64::from(per_page) + extra_page) as i32;
        Ok(Page {
            results,
            page,
            per_page,
            total_pages,
        })
    }
}

impl<T: Query> Query for PaginatedQuery<T> {
    type SqlType = (T::SqlType, BigInt);
}

impl<T> QueryFragment<Pg> for PaginatedQuery<T>
where
    T: QueryFragment<Pg>,
{
    fn walk_ast<'b>(&'b self, mut out: AstPass<'_, 'b, Pg>) -> QueryResult<()> {
        out.push_sql("SELECT *, COUNT(*) OVER () FROM (");
        self.query.walk_ast(out.reborrow())?;
        out.push_sql(") t LIMIT ");
        out.push_bind_param::<Integer, _>(&self.per_page)?;
        out.push_sql(" OFFSET ");
        out.push_bind_param::<Integer, _>(&self.offset)?;
        Ok(())
    }
}
