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

    /// Used to convert the result of a pagination query to a page.
    pub fn from_query_result(query_result: Vec<(T, i64)>, per_page: i32, page: i32) -> Self {
        let total = query_result.get(0).map_or(0, |x| x.1);
        let results = query_result.into_iter().map(|x| x.0).collect();
        let extra_page = match total % i64::from(per_page) {
            0 => 0,
            _ => 1,
        };
        #[allow(clippy::cast_possible_truncation, clippy::integer_division)]
        let total_pages = (total / i64::from(per_page) + extra_page) as i32;
        Self {
            results,
            page,
            per_page,
            total_pages,
        }
    }
}
