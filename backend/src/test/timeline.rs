//! Tests for [`crate::controller::timeline`].

use std::collections::HashMap;

use crate::error::ServiceError;
use crate::model::dto::timeline::{TimelineDto, TimelineEntryDto};
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

    let expectation = TimelineDto {
        years: HashMap::from([
            (
                "2023".to_owned(),
                TimelineEntryDto {
                    additions: 4,
                    removals: 2,
                },
            ),
            (
                "2020".to_owned(),
                TimelineEntryDto {
                    additions: 0,
                    removals: 1,
                },
            ),
            (
                "2024".to_owned(),
                TimelineEntryDto {
                    additions: 1,
                    removals: 0,
                },
            ),
        ]),
        months: HashMap::from([
            (
                "2023-05".to_owned(),
                TimelineEntryDto {
                    additions: 4,
                    removals: 0,
                },
            ),
            (
                "2023-06".to_owned(),
                TimelineEntryDto {
                    additions: 0,
                    removals: 2,
                },
            ),
            (
                "2020-01".to_owned(),
                TimelineEntryDto {
                    additions: 0,
                    removals: 1,
                },
            ),
            (
                "2024-05".to_owned(),
                TimelineEntryDto {
                    additions: 1,
                    removals: 0,
                },
            ),
        ]),
        dates: HashMap::from([
            (
                "2024-05-08".to_owned(),
                TimelineEntryDto {
                    additions: 1,
                    removals: 0,
                },
            ),
            (
                "2023-06-08".to_owned(),
                TimelineEntryDto {
                    additions: 0,
                    removals: 2,
                },
            ),
            (
                "2020-01-01".to_owned(),
                TimelineEntryDto {
                    additions: 0,
                    removals: 1,
                },
            ),
            (
                "2023-05-08".to_owned(),
                TimelineEntryDto {
                    additions: 2,
                    removals: 0,
                },
            ),
            (
                "2023-05-10".to_owned(),
                TimelineEntryDto {
                    additions: 1,
                    removals: 0,
                },
            ),
            (
                "2023-05-11".to_owned(),
                TimelineEntryDto {
                    additions: 1,
                    removals: 0,
                },
            ),
        ]),
    };

    let resp = test::TestRequest::get()
        .uri("/api/maps/-1/timeline?start=2000-01-01&end=2040-01-01")
        .insert_header((header::AUTHORIZATION, token))
        .send_request(&app)
        .await;
    assert_eq!(resp.status(), StatusCode::OK);

    let result: TimelineDto = test::read_body_json(resp).await;
    assert_eq!(result, expectation);
}

#[actix_rt::test]
async fn test_calculate_timeline_map_not_found() {
    let pool = init_test_database(|conn| initial_db_values(conn).scope_boxed()).await;
    let (token, app) = init_test_app(pool).await;

    // return 404 if the map id is not present in the database
    let resp = test::TestRequest::get()
        .uri("/api/maps/-1000/timeline?start=2000-01-01&end=2020-01-01")
        .insert_header((header::AUTHORIZATION, token))
        .send_request(&app)
        .await;
    assert_eq!(resp.status(), StatusCode::NOT_FOUND);
}

#[actix_rt::test]
async fn test_calculate_timeline_invalid_requests() {
    let pool = init_test_database(|conn| initial_db_values(conn).scope_boxed()).await;
    let (token, app) = init_test_app(pool).await;

    // timeline needs start and end dates, here either start, end or both are missing
    let resp = test::TestRequest::get()
        .uri("/api/maps/-1/timeline")
        .insert_header((header::AUTHORIZATION, token.clone()))
        .send_request(&app)
        .await;
    assert_eq!(resp.status(), StatusCode::BAD_REQUEST);
    let resp = test::TestRequest::get()
        .uri("/api/maps/-1/timeline?start=2000-01-01")
        .insert_header((header::AUTHORIZATION, token.clone()))
        .send_request(&app)
        .await;
    assert_eq!(resp.status(), StatusCode::BAD_REQUEST);
    let resp = test::TestRequest::get()
        .uri("/api/maps/-1/timeline?end=2000-01-01")
        .insert_header((header::AUTHORIZATION, token.clone()))
        .send_request(&app)
        .await;
    assert_eq!(resp.status(), StatusCode::BAD_REQUEST);

    // Only except correct format, here it's dd-mm-yyyy instead of yyyy-mm-dd
    let resp = test::TestRequest::get()
        .uri("/api/maps/-1/timeline?start=01-01-2000&end=01-01-2020")
        .insert_header((header::AUTHORIZATION, token.clone()))
        .send_request(&app)
        .await;
    assert_eq!(resp.status(), StatusCode::BAD_REQUEST);

    // We should return 422 if start > end (we understand the request but the data is invalid)
    let resp = test::TestRequest::get()
        .uri("/api/maps/-1/timeline?start=2000-01-01&end=1900-01-01")
        .insert_header((header::AUTHORIZATION, token))
        .send_request(&app)
        .await;
    assert_eq!(resp.status(), StatusCode::UNPROCESSABLE_ENTITY);
}
