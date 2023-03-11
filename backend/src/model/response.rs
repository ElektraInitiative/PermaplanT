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
    pub fn new(message: &str, data: T) -> Self {
        Self {
            message: message.to_owned(),
            data,
        }
    }
}
