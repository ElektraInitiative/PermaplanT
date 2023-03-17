//! [`Body`] and its implementation.

use serde::{Deserialize, Serialize};
use typeshare::typeshare;

/// The default return type of the server.
#[typeshare]
#[derive(Debug, Serialize, Deserialize)]
pub struct Body<T> {
    /// An additional message to be sent back together with the actual data.
    pub message: String,
    /// Data to be sent back on a request.
    pub data: T,
}

impl<T> Body<T> {
    /// Creates a response to be sent back containing a message and some data.
    pub const fn new(message: String, data: T) -> Self {
        Self { message, data }
    }
}

impl<T> From<T> for Body<T> {
    fn from(value: T) -> Self {
        Self::new("ok".to_owned(), value)
    }
}
