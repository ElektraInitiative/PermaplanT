//! Tests for [`crate::controller::guided_tours`].

use actix_http::StatusCode;
use actix_web::{http::header, test};
use diesel::ExpressionMethods;
use diesel_async::{scoped_futures::ScopedFutureExt, RunQueryDsl};
use uuid::Uuid;

use crate::model::dto::{GuidedToursDto, UpdateGuidedToursDto};

use super::util::{init_test_app, init_test_app_for_user, init_test_database};

#[actix_rt::test]
async fn test_can_setup_status_object() {
    let pool = init_test_database(|_| async { Ok(()) }.scope_boxed()).await;
    let (token, app) = init_test_app(pool.clone()).await;

    let resp = test::TestRequest::post()
        .uri("/api/tours")
        .insert_header((header::AUTHORIZATION, token))
        .send_request(&app)
        .await;
    assert_eq!(resp.status(), StatusCode::CREATED);
}

#[actix_rt::test]
async fn test_can_find_status_object() {
    let user_id = Uuid::new_v4();
    let pool = init_test_database(|conn| {
        async {
            diesel::insert_into(crate::schema::guided_tours::table)
                .values((
                    &crate::schema::guided_tours::user_id.eq(user_id),
                    &crate::schema::guided_tours::editor_tour_completed.eq(false),
                ))
                .execute(conn)
                .await?;
            Ok(())
        }
        .scope_boxed()
    })
    .await;
    let (token, app) = init_test_app_for_user(pool.clone(), user_id).await;

    let resp = test::TestRequest::get()
        .uri("/api/tours")
        .insert_header((header::AUTHORIZATION, token))
        .send_request(&app)
        .await;
    assert_eq!(resp.status(), StatusCode::OK);
}

#[actix_rt::test]
async fn test_can_update_status_object() {
    let user_id = Uuid::new_v4();
    let pool = init_test_database(|conn| {
        async {
            diesel::insert_into(crate::schema::guided_tours::table)
                .values((
                    &crate::schema::guided_tours::user_id.eq(user_id),
                    &crate::schema::guided_tours::editor_tour_completed.eq(false),
                ))
                .execute(conn)
                .await?;
            Ok(())
        }
        .scope_boxed()
    })
    .await;
    let (token, app) = init_test_app_for_user(pool.clone(), user_id).await;

    let status_update = UpdateGuidedToursDto {
        editor_tour_completed: Some(true),
    };

    let resp = test::TestRequest::patch()
        .uri("/api/tours")
        .insert_header((header::AUTHORIZATION, token))
        .set_json(status_update)
        .send_request(&app)
        .await;
    assert_eq!(resp.status(), StatusCode::OK);

    let updated_object: GuidedToursDto = test::read_body_json(resp).await;
    assert_ne!(updated_object.editor_tour_completed, false);
}
