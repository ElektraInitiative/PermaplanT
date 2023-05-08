//! Tests for [`crate::controller::map`].

use crate::{
    model::dto::{MapDto, NewMapDto},
    test::test_utils::{init_test_app, init_test_database},
};
use actix_web::{http::StatusCode, test};
use chrono::NaiveDate;
use diesel::ExpressionMethods;
use diesel_async::{scoped_futures::ScopedFutureExt, RunQueryDsl};

#[actix_rt::test]
async fn test_can_find_map() {
    let pool = init_test_database(|conn| {
        async {
            diesel::insert_into(crate::schema::maps::table)
                .values((
                    &crate::schema::maps::id.eq(-1),
                    &crate::schema::maps::name.eq("My Map"),
                    &crate::schema::maps::creation_date
                        .eq(NaiveDate::from_ymd_opt(2023, 5, 8).expect("Could not parse date!")),
                    &crate::schema::maps::is_inactive.eq(false),
                    &crate::schema::maps::zoom_factor.eq(100),
                    &crate::schema::maps::honors.eq(0),
                    &crate::schema::maps::visits.eq(0),
                    &crate::schema::maps::harvested.eq(0),
                    &crate::schema::maps::owner_id.eq(-1),
                ))
                .execute(conn)
                .await?;
            Ok(())
        }
        .scope_boxed()
    })
    .await;
    let app = init_test_app(pool.clone()).await;

    let resp = test::TestRequest::get()
        .uri("/api/maps/-1")
        .send_request(&app)
        .await;

    assert_eq!(resp.status(), StatusCode::OK);
}
