//! Tests for authorization.

use crate::test::util::{init_test_app, init_test_database};
use actix_web::{
    http::{header, StatusCode},
    test,
};
use diesel_async::scoped_futures::ScopedFutureExt;

#[actix_web::test]
async fn test_with_token_succeeds() {
    let pool = init_test_database(|_| async { Ok(()) }.scope_boxed()).await;
    let (token, app) = init_test_app(pool.clone()).await;

    let resp = test::TestRequest::get()
        .uri("/api/seeds")
        .insert_header((header::AUTHORIZATION, token))
        .send_request(&app)
        .await;

    assert_eq!(resp.status(), StatusCode::OK);
}

#[actix_web::test]
async fn test_missing_token_fails() {
    let pool = init_test_database(|_| async { Ok(()) }.scope_boxed()).await;
    let (_, app) = init_test_app(pool.clone()).await;

    let resp = test::TestRequest::get()
        .uri("/api/seeds")
        .send_request(&app)
        .await;

    assert_eq!(resp.status(), StatusCode::UNAUTHORIZED);
}
