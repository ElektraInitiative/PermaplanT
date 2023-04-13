//! Paginate queries.

use diesel::pg::Pg;
use diesel::query_builder::{AstPass, Query, QueryFragment};
use diesel::sql_types::BigInt;
use diesel::{QueryId, QueryResult};
use diesel_async::methods::LoadQuery;
use diesel_async::{AsyncPgConnection, RunQueryDsl};
use serde::{Deserialize, Serialize};
use std::cmp::max;
use typeshare::typeshare;
use utoipa::ToSchema;

/// The default number of results for a paginated query.
const DEFAULT_PER_PAGE: i64 = 10;
/// The minimum value for page number in a paginated query.
const MIN_PAGE: i64 = 1;
/// The minimum value for `per_page` in a paginated query.
const MIN_PER_PAGE: i64 = 1;

/// An executable paginated query.
#[derive(Debug, Clone, Copy, QueryId)]
pub struct PaginatedQuery<T> {
    /// Executable query.
    query: T,
    /// Page number to be loaded.
    page: i64,
    /// Number of rows loaded in a the query.
    per_page: i64,
    /// Offset to the the first row in the query.
    offset: i64,
}

/// A trait intended for enabling pagination in diesels query builder.
pub trait Paginate: Sized {
    /// Return a paginated version of a query for a specific page number.
    fn paginate(self, page: Option<i64>) -> PaginatedQuery<Self>;
}

impl<T> Paginate for T {
    fn paginate(self, page: Option<i64>) -> PaginatedQuery<Self> {
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
    #[allow(clippy::missing_const_for_fn)]
    pub fn per_page(self, per_page: Option<i64>) -> Self {
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
        #[allow(clippy::cast_possible_truncation, clippy::cast_precision_loss)]
        let total_pages = (total as f64 / per_page as f64).ceil() as i64;
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
        out.push_bind_param::<BigInt, _>(&self.per_page)?;
        out.push_sql(" OFFSET ");
        out.push_bind_param::<BigInt, _>(&self.offset)?;
        Ok(())
    }
}

/// A page of results returned from a list endpoint.
#[typeshare]
#[derive(Debug, Serialize, PartialEq, Eq, Deserialize, ToSchema)]
pub struct Page<T> {
    /// Resulting records.
    pub results: Vec<T>,
    /// Current page number.
    pub page: i64,
    /// Results per page.
    pub per_page: i64,
    /// Number of pages in total.
    pub total_pages: i64,
}

impl<T> Page<T> {
    /// Used to convert from a page of entities to a page of dto.
    //
    // NOTE: I tried to use the `From` trait like this but got the following error.
    // conflicting implementations of trait `std::convert::From<db::pagination::Page<_>>`
    // for type `db::pagination::Page<_>` [E0119] Note: conflicting implementation in crate `core`:,
    // ```
    // impl<T, U> From<Page<U>> for Page<T>
    //     where
    //         T: From<U>,
    // {
    //     fn from(value: Page<U>) -> Self {
    //         ...
    //     }
    // }
    // ```
    pub fn from<U>(value: Page<U>) -> Self
    where
        T: From<U>,
    {
        Self {
            results: value.results.into_iter().map(Into::into).collect(),
            page: value.page,
            per_page: value.per_page,
            total_pages: value.total_pages,
        }
    }
}
