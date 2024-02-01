//! Tests for [`crate::controller::blossoms`].

use actix_http::StatusCode;
use actix_web::{http::header, test};
use chrono::NaiveDate;
use diesel::ExpressionMethods;
use diesel_async::{scoped_futures::ScopedFutureExt, RunQueryDsl};

use crate::model::dto::GainedBlossomsDto;

use super::util::{init_test_app, init_test_database};

#[actix_rt::test]
async fn test_can_gain_blossom() {
    let pool = init_test_database(|conn| {
        async {
            diesel::insert_into(crate::schema::blossoms::table)
                .values((
                    &crate::schema::blossoms::title.eq("Brave Tester"),
                    &crate::schema::blossoms::is_seasonal.eq(false),
                ))
                .execute(conn)
                .await?;
            Ok(())
        }
        .scope_boxed()
    })
    .await;
    let (token, app) = init_test_app(pool.clone()).await;

    let gained_blossom = GainedBlossomsDto {
        blossom: "Brave Tester".to_owned(),
        times_gained: 1,
        gained_date: NaiveDate::from_ymd_opt(2023, 7, 18).expect("Could not parse date!"),
    };

    let resp = test::TestRequest::post()
        .uri("/api/blossoms")
        .insert_header((header::AUTHORIZATION, token))
        .set_json(gained_blossom)
        .send_request(&app)
        .await;
    assert_eq!(resp.status(), StatusCode::CREATED);
}
