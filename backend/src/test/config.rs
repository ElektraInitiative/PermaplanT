//! Tests for [`crate::controller::config`].

use actix_http::header::CONTENT_TYPE;
use actix_web::{http::StatusCode, test, App};

use crate::{config::routes, model::dto::ConfigDto, test::util::jwks::init_auth};

#[actix_web::test]
async fn test_search_plants_succeeds() {
    // Has to be done way as static variables are shared in tests and /api/config requires static vars
    init_auth();
    let app = test::init_service(App::new().configure(routes::config)).await;

    let resp = test::TestRequest::get()
        .uri("/api/config")
        .send_request(&app)
        .await;

    assert_eq!(resp.status(), StatusCode::OK);
    assert_eq!(
        resp.headers().get(CONTENT_TYPE).unwrap(),
        "application/json"
    );

    let result = test::read_body(resp).await;
    let result = std::str::from_utf8(&result).unwrap();
    let result: ConfigDto = serde_json::from_str(result).unwrap();

    assert_eq!(result.client_id, "PermaplanT".to_owned());
}
