//! Tests for [`crate::controller::user_data`].

use actix_http::StatusCode;
use actix_web::{http::header, test};
use diesel_async::{scoped_futures::ScopedFutureExt, RunQueryDsl};
use uuid::Uuid;

use crate::model::{
    dto::{GuidedToursDto, UserDataDto},
    r#enum::salutation::Salutation,
};
use diesel::ExpressionMethods;

use super::util::{init_test_app, init_test_app_for_user, init_test_database};

#[actix_rt::test]
async fn test_can_create_user_data() {
    let pool = init_test_database(|_| async { Ok(()) }.scope_boxed()).await;
    let (token, app) = init_test_app(pool.clone()).await;

    let user_data = UserDataDto {
        salutation: Salutation::Mr,
        title: None,
        country: "Austria".to_string(),
        phone: None,
        website: None,
        organization: None,
        experience: None,
        membership: None,
        member_years: None,
        member_since: None,
        permacoins: None,
        editor_introduction: false,
    };

    let resp = test::TestRequest::post()
        .uri("/api/users")
        .insert_header((header::AUTHORIZATION, token))
        .set_json(user_data)
        .send_request(&app)
        .await;
    assert_eq!(resp.status(), StatusCode::CREATED);
}

#[actix_rt::test]
async fn test_can_get_tour_status() {
    let user_id = Uuid::new_v4();
    let pool = init_test_database(|conn| {
        async {
            diesel::insert_into(crate::schema::user_data::table)
                .values((
                    crate::schema::user_data::id.eq(user_id),
                    crate::schema::user_data::salutation.eq(Salutation::Mr),
                    crate::schema::user_data::country.eq("Austria"),
                    crate::schema::user_data::editor_introduction.eq(true),
                ))
                .execute(conn)
                .await?;
            Ok(())
        }
        .scope_boxed()
    })
    .await;
    let (token, app) = init_test_app_for_user(pool.clone(), user_id.clone()).await;

    let resp = test::TestRequest::get()
        .uri(&format!("/api/users/{user_id}/tours"))
        .insert_header((header::AUTHORIZATION, token))
        .send_request(&app)
        .await;
    assert_eq!(resp.status(), StatusCode::OK);

    let tour_status: GuidedToursDto = test::read_body_json(resp).await;
    assert_eq!(tour_status.editor_introduction, true);
}
