//! Contains the implementation of [`Page`].

use crate::model::dto::Page;

impl<T> Page<T> {
    /// Used to convert from a page of entities to a page of dto.
    //
    // Implementing the [`From`] trait with the types used here leads to a conflicting implementation.
    // See. https://stackoverflow.com/a/37347504
    pub fn from_entity<U>(value: Page<U>) -> Self
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
