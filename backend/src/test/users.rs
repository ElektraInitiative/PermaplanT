//! Tests for [`crate::controller::users`].

use actix_http::StatusCode;
use actix_web::{http::header, test};
use diesel_async::scoped_futures::ScopedFutureExt;

use crate::model::{dto::UsersDto, r#enum::salutation::Salutation};

use super::util::{init_test_app, init_test_database};

#[actix_rt::test]
async fn test_can_create_user_data() {
    let pool = init_test_database(|_| async { Ok(()) }.scope_boxed()).await;
    let (token, app) = init_test_app(pool.clone()).await;

    let user_data = UsersDto {
        salutation: Salutation::Mr,
        title: None,
        country: "Austria".to_owned(),
        phone: None,
        website: None,
        organization: None,
        experience: None,
        membership: None,
        member_years: None,
        member_since: None,
        permacoins: None,
    };

    let resp = test::TestRequest::post()
        .uri("/api/users")
        .insert_header((header::AUTHORIZATION, token))
        .set_json(user_data)
        .send_request(&app)
        .await;
    assert_eq!(resp.status(), StatusCode::CREATED);
}
