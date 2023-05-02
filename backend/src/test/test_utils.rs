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
    #[derive(Debug, Clone, Serialize)]
    struct TokenClaims {
        exp: u64,
        sub: Uuid,
        scope: String,
    }
    let jwk_json = "{
        \"p\": \"4hnyVSiCG5huFRbWmxii72CvGGF3OCQmdJsKMmsqklYg9cBSfu7N8JfSJ6P5yiMA7uzJc5uVpaZYBIu3lEYAoWKHGYMw0GQaLXb7lhyzOwTvgmhx4cHgKJAmMhiGogAyOBfpLiFYfF9idEvuANOhv5MoqF4DIeubSaTOz3btwws\",
        \"kty\": \"RSA\",
        \"q\": \"t4h-2-Jw2x9F1A4Gh_pynFkOkeZ2wMDdFhn3N9_ESoNUfQzlxSo83f8458xDgCX18soEHN5bdebi-Ct0Z-2cZ82Uylq3qc-RwYnomDG3XHAkvktHzInBq7D6OSjlby7mqZRT02304K8yku52Ij3WK6OwvlkYwg2nPWDY5OVYSCM\",
        \"d\": \"UCrR9D0W6alQTgeX-o0Ccm9eHo1sBhD46ikNMOnD3ZjFKZebjBBDG7-2wqTGl8px_36XcncxyTI28VfJxzK2dv6OwKRL5b2l0-GjTtjd0EeIJGKeJJWPxXKDI7cCgc6PzDpIkjnqKGbSsoMjicqdneFWMW8vn9tyyBIE7A2bXM4ut--kO-TkcbFUkCSj7F0ILn_l5s1faHax2mEjWiEfuuDQd50WvHT2ZHU5f1mAY4aBai7lL8X3_47CdnwmTRiKtroVyLaafB5X1BjpdAtaEjXyJxNx1ruBQxmsvIjJ6upJty3qVDUVzZ_xrV3BZ_jeQN2uDIkfOVyWrha32sIPMQ\",
        \"e\": \"AQAB\",
        \"kid\": \"xbAmoPN1JqIdB8OBXSV_VWCqa_abNt5_P_Pz3K-j4p8\",
        \"qi\": \"2oMDuZbhKBZ5J1DROzJIe31bu8DeL5rBow_i45bKh1gSY1Hesz2Tl27zTPp0wwYa6NPpmJZ1zSqlTvpF1eRk9xmUZAAI9qhPnA8vm2ofLR7kllVTSbCLIWFq3DR5lQHN29dM95cirWcv8uTwj9kspl0Obtj26DBhmtqQoycFR_s\",
        \"dp\": \"jHnudDZcz-Re0L-Fyor-AJgjcZRsy_a55czGAxlOM-lLRSSenLqmPQs2yOY6NfqVg9yeNTO_QFIfcYOVJYxwq9RZd-Jom7D2CrVYDqX6PXsNjAp0Zv1b1hfpg0p1q4VPrkY83CpfnbZtpy_dyamzXyGBK0pty89khdbdn0yW4I0\",
        \"alg\": \"RS256\",
        \"dq\": \"k5kI9Iqh2gbHYGc7J2XpgAU662jdPdycsGaHY37oXEhLzRlvO2Xhd2MGf5vM-SUOK4f9UL4d7a6V_6Dqx53Wd8BkFWxpYf4VKQFgde0dmhBx7DucbUin4Qy93vQdt5GPXPd1hoZaNcuPr4xootb6AzRsMlhyybSzN3BIXaR3n-M\",
        \"n\": \"ohkaDpapVHNUsj-Mw8qFQYHSLGKHLvSWOA_azHaTWId-XCneus8ukYpuBrnHKxHdQ0RDvocwf6sUFv1nBH14SffEmTAnAIyeOyNo3J3wl2_f_tI9ykHwGcxRbvDaUNLt2x2T3EGPGqQOevGcE_PM4tTH8aLO7Zr8VNWL6UXZGKEsfyO57r7GPg0dwiT7BbI4kYX4LfxdWA-5OIUsNMo6rm7fM5AE3EEjZcE19IMsHyBOz5srDTD0rCZ_xirqzbdR6OdzCbML_pn8_KnnUuiyazDIyD3v9qAXaR2C13BaAQkvRwK6fePDYJSUlio_nE6cyC12Vv7q6YZj2S7QBCTCgQ\"
    }";
    let jwk1 = serde_json::from_str::<jsonwebtoken::jwk::Jwk>(jwk_json).unwrap();
    let jwk2 = serde_json::from_str::<jsonwebkey::JsonWebKey>(jwk_json).unwrap();

    Jwks::init(JwkSet {
        keys: vec![jwk1.clone()],
    });

    let mut header = jsonwebtoken::Header::new(jwk2.algorithm.unwrap().into());
    header.kid = Some(jwk2.key_id.clone().unwrap());
    let token = jsonwebtoken::encode(
        &header,
        &TokenClaims {
            exp: SystemTime::now()
                .duration_since(UNIX_EPOCH)
                .unwrap()
                .as_secs()
                + 300,
            sub: Uuid::new_v4(),
            scope: "".to_string(),
        },
        &jwk2.key.to_encoding_key(),
    )
    .unwrap();

    // Validate token
    println!("{token}");
    let header = jsonwebtoken::decode_header(&token).unwrap();
    let value = jsonwebtoken::decode::<serde_json::Value>(
        &token,
        &jsonwebtoken::DecodingKey::from_jwk(&jwk1).unwrap(),
        &jsonwebtoken::Validation::new(header.alg),
    )
    .unwrap();
    println!("{:?}", value.claims);

    token
}
