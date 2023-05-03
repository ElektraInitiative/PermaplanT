//! Configuration of the server.

pub mod api_doc;
pub mod app;
#[cfg(any(test, feature = "auth"))]
pub mod auth;
pub mod routes;
