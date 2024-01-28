//! Tests for [`crate::controller::timeline`].

use crate::error::ServiceError;
use crate::model::dto::timeline::TimelineDto;
use crate::test::util::init_test_database;
use actix_http::{header, StatusCode};
use actix_web::test;
use chrono::NaiveDate;
use diesel_async::AsyncPgConnection;
use diesel_async::{scoped_futures::ScopedFutureExt, RunQueryDsl};
use uuid::Uuid;

use super::util::{data, init_test_app};

async fn initial_db_values(conn: &mut AsyncPgConnection) -> Result<(), ServiceError> {
    diesel::insert_into(crate::schema::maps::table)
        .values(data::TestInsertableMap::default())
        .execute(conn)
        .await?;
    diesel::insert_into(crate::schema::layers::table)
        .values(data::TestInsertableLayer::default())
        .execute(conn)
        .await?;
    diesel::insert_into(crate::schema::plants::table)
        .values(data::TestInsertablePlant::default())
        .execute(conn)
        .await?;
    diesel::insert_into(crate::schema::plantings::table)
        .values(vec![
            data::TestInsertablePlanting {
                id: Uuid::new_v4(),
                layer_id: -1,
                plant_id: -1,
                add_date: NaiveDate::from_ymd_opt(2023, 5, 8),
                ..Default::default()
            },
            data::TestInsertablePlanting {
                id: Uuid::new_v4(),
                layer_id: -1,
                plant_id: -1,
                add_date: NaiveDate::from_ymd_opt(2023, 5, 8),
                ..Default::default()
            },
            data::TestInsertablePlanting {
                id: Uuid::new_v4(),
                layer_id: -1,
                plant_id: -1,
                add_date: NaiveDate::from_ymd_opt(2023, 5, 10),
                remove_date: NaiveDate::from_ymd_opt(2023, 6, 8),
                ..Default::default()
            },
            data::TestInsertablePlanting {
                id: Uuid::new_v4(),
                layer_id: -1,
                plant_id: -1,
                add_date: NaiveDate::from_ymd_opt(2023, 5, 11),
                remove_date: NaiveDate::from_ymd_opt(2023, 6, 8),
                ..Default::default()
            },
            data::TestInsertablePlanting {
                id: Uuid::new_v4(),
                layer_id: -1,
                plant_id: -1,
                add_date: NaiveDate::from_ymd_opt(2024, 5, 8),
                ..Default::default()
            },
            data::TestInsertablePlanting {
                id: Uuid::new_v4(),
                layer_id: -1,
                plant_id: -1,
                remove_date: NaiveDate::from_ymd_opt(2020, 1, 1),
                ..Default::default()
            },
        ])
        .execute(conn)
        .await?;
    Ok(())
}

#[actix_rt::test]
async fn test_calculate_timeline() {
    let pool = init_test_database(|conn| initial_db_values(conn).scope_boxed()).await;
    let (token, app) = init_test_app(pool).await;

    let resp = test::TestRequest::get()
        .uri("/api/timeline")
        .param("start", "2000-01-01")
        .param("end", "2020-01-01")
        .insert_header((header::AUTHORIZATION, token))
        .send_request(&app)
        .await;
    assert_eq!(resp.status(), StatusCode::OK);

    let timeline: TimelineDto = test::read_body_json(resp).await;
    dbg!("Got timeline: {}", timeline);
    // assert_eq!(timeline.results.len(), 0);
}
