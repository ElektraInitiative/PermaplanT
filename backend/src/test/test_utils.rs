//! Test utilities

use std::time::{SystemTime, UNIX_EPOCH};

use actix_http::Request;
use actix_web::{
    body::MessageBody,
    dev::{Service, ServiceResponse},
    test,
    web::Data,
    App, Error,
};
use diesel_async::{
    pooled_connection::{deadpool::Pool, AsyncDieselConnectionManager},
    scoped_futures::ScopedBoxFuture,
    AsyncConnection, AsyncPgConnection,
};
use dotenvy::dotenv;
use jsonwebtoken::jwk::JwkSet;
use serde::Serialize;
use uuid::Uuid;

use crate::config::{app, auth::jwks::Jwks, routes};
use crate::error::ServiceError;

/// Initializes a test database with the given initializer function.
///
/// All transactions are run inside [`AsyncConnection::begin_test_transaction`].
///
/// The pool is limited to 1 connection.
pub async fn init_test_database<'a, F>(init_database: F) -> Pool<AsyncPgConnection>
where
    F: for<'r> FnOnce(
            &'r mut AsyncPgConnection,
        ) -> ScopedBoxFuture<'a, 'r, Result<(), ServiceError>>
        + Send
        + 'a,
{
    dotenv().ok();
    let app_config = app::Config::from_env().expect("Error loading configuration");

    let manager = AsyncDieselConnectionManager::<AsyncPgConnection>::new(app_config.database_url);
    let pool = Pool::builder(manager)
        .max_size(1) // allow only one connection (which is the test transaction)
        .build()
        .expect("Failed to init pool");

    let mut conn = pool
        .get()
        .await
        .expect("Failed to get connection from pool");

    conn.begin_test_transaction()
        .await
        .expect("Failed to begin test transaction");

    conn.transaction(|conn| init_database(conn))
        .await
        .expect("Failed to initialize test database");

    pool
}

/// Create the test service out of the connection pool.
///
/// Returns a token in bearer format ("Bearer <token>") and the app to send the request to.
pub async fn init_test_app(
    pool: Pool<AsyncPgConnection>,
) -> (
    String,
    impl Service<Request, Response = ServiceResponse<impl MessageBody>, Error = Error>,
) {
    let token = setup_auth();

    let app = test::init_service(
        App::new()
            .app_data(Data::new(pool))
            .configure(routes::config),
    )
    .await;
    (format!("Bearer {token}"), app)
}

fn setup_auth() -> String {
    // Load key from pre generated one. Both crates are necessary as jsonwebtoken cannot generate an encoding key from a jwk.
    let jwk_json = include_str!("test_jwk.json");
    let jwk1 = serde_json::from_str::<jsonwebtoken::jwk::Jwk>(jwk_json).unwrap();
    let jwk2 = serde_json::from_str::<jsonwebkey::JsonWebKey>(jwk_json).unwrap();

    // Init application jwks
    Jwks::init_for_tests(JwkSet {
        keys: vec![jwk1.clone()],
    });

    // Generate token
    let mut header = jsonwebtoken::Header::new(jwk2.algorithm.unwrap().into());
    header.kid = Some(jwk2.key_id.clone().unwrap());
    let token = jsonwebtoken::encode(
        &header,
        &TokenClaims::default(),
        &jwk2.key.to_encoding_key(),
    )
    .unwrap();

    // Check if generated token is correct
    let alg = jsonwebtoken::decode_header(&token).unwrap().alg;
    jsonwebtoken::decode::<serde_json::Value>(
        &token,
        &jsonwebtoken::DecodingKey::from_jwk(&jwk1).unwrap(),
        &jsonwebtoken::Validation::new(alg),
    )
    .expect("Failed to decode token. Something in the test setup is wrong.");

    token
}

#[derive(Debug, Clone, Serialize)]
struct TokenClaims {
    exp: u64,
    sub: Uuid,
    scope: String,
}

impl Default for TokenClaims {
    fn default() -> Self {
        Self {
            exp: SystemTime::now()
                .duration_since(UNIX_EPOCH)
                .expect("Time went backwards!")
                .as_secs()
                + 300,
            sub: Uuid::new_v4(),
            scope: String::new(),
        }
    }
}
