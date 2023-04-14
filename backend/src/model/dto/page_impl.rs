//! Contains the implementation of [`Page`].
//!
use crate::model::dto::Page;

impl<T> Page<T> {
    /// Used to convert from a page of entities to a page of dto.
    //
    // NOTE: I tried to use the `From` trait like this but got the following error.
    // conflicting implementations of trait `std::convert::From<db::pagination::Page<_>>`
    // for type `db::pagination::Page<_>` [E0119] Note: conflicting implementation in crate `core`:,
    // Seems like this is not possible at the moment.
    // See. https://stackoverflow.com/a/37347504
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
