//! Test utilities

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

use crate::{
    config::{app, routes},
    error::ServiceError,
    keycloak_api,
    sse::broadcaster::Broadcaster,
};

use self::token::{generate_token, generate_token_for_user};

pub mod data;
pub mod dummy_map_polygons;
pub mod jwks;
pub mod token;

/// Initializes a test database with the given initializer function.
///
/// All transactions are run inside [`AsyncConnection::begin_test_transaction`].
///
/// The pool is limited to 1 connection.
///
/// # Panics
/// - If the configuration cannot be loaded.
/// - If the pool cannot be initialized.
/// - If the test transaction cannot be started.
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

    conn.transaction(|c| init_database(c))
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
    let app = init_test_app_impl(pool).await;
    let token = setup_auth();

    (format!("Bearer {token}"), app)
}

pub async fn init_test_app_for_user(
    pool: Pool<AsyncPgConnection>,
    user_id: uuid::Uuid,
) -> (
    String,
    impl Service<Request, Response = ServiceResponse<impl MessageBody>, Error = Error>,
) {
    let app = init_test_app_impl(pool).await;
    let token = setup_auth_for_user(user_id);

    (format!("Bearer {token}"), app)
}

async fn init_test_app_impl(
    pool: Pool<AsyncPgConnection>,
) -> impl Service<Request, Response = ServiceResponse<impl MessageBody>, Error = Error> {
    test::init_service(
        App::new()
            .app_data(Data::new(pool))
            .app_data(Data::new(Broadcaster::new()))
            .app_data(Data::new(keycloak_api::api::Api::new(
                &app::Config::from_env().expect("Error loading configuration"),
            )))
            .app_data(Data::new(reqwest::Client::new()))
            .configure(routes::config),
    )
    .await
}

fn setup_auth() -> String {
    let jwk = jwks::init_auth();
    generate_token(&jwk, 300)
}

fn setup_auth_for_user(user_id: uuid::Uuid) -> String {
    let jwk = jwks::init_auth();
    generate_token_for_user(&jwk, 300, user_id)
}
