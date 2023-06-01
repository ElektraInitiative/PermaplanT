//! Tests for [`crate::controller::map`].

use crate::{
    model::dto::{MapDto, MapVersionDto, NewMapDto, NewMapVersionDto, Page},
    test::util::{init_test_app, init_test_database},
};
use actix_web::{
    http::{header, StatusCode},
    test,
};
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
    let (token, app) = init_test_app(pool.clone()).await;

    let resp = test::TestRequest::get()
        .uri("/api/maps/-1")
        .insert_header((header::AUTHORIZATION, token))
        .send_request(&app)
        .await;

    assert_eq!(resp.status(), StatusCode::OK);
}

#[actix_rt::test]
async fn test_can_search_maps() {
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
    let (token, app) = init_test_app(pool.clone()).await;

    let resp = test::TestRequest::get()
        .uri("/api/maps?is_inactive=false&per_page=10")
        .insert_header((header::AUTHORIZATION, token))
        .send_request(&app)
        .await;

    assert_eq!(resp.status(), StatusCode::OK);

    let result = test::read_body(resp).await;
    let result_string = std::str::from_utf8(&result).unwrap();
    let page: Page<MapDto> = serde_json::from_str(result_string).unwrap();

    assert!(page.results.len() > 0);
}

#[actix_rt::test]
async fn test_can_create_map() {
    let pool = init_test_database(|_| async { Ok(()) }.scope_boxed()).await;
    let (token, app) = init_test_app(pool.clone()).await;

    let new_map = NewMapDto {
        name: "My Map".to_string(),
        creation_date: NaiveDate::from_ymd_opt(2023, 5, 8).expect("Could not parse date!"),
        deletion_date: None,
        last_visit: None,
        is_inactive: false,
        zoom_factor: 100,
        honors: 0,
        visits: 0,
        harvested: 0,
        owner_id: -1,
        is_private: None,
        description: None,
        location: None,
    };

    let resp = test::TestRequest::post()
        .uri("/api/maps")
        .insert_header((header::AUTHORIZATION, token.clone()))
        .set_json(new_map)
        .send_request(&app)
        .await;

    assert_eq!(resp.status(), StatusCode::CREATED);

    let map: MapDto = test::read_body_json(resp).await;
    let resp = test::TestRequest::get()
        .uri(&format!("/api/maps/{}", map.id))
        .insert_header((header::AUTHORIZATION, token))
        .send_request(&app)
        .await;

    assert_eq!(resp.status(), StatusCode::OK);
}

#[actix_rt::test]
async fn test_can_save_snapshot() {
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
    let (token, app) = init_test_app(pool.clone()).await;

    let new_version = NewMapVersionDto {
        map_id: -1,
        version_name: "Version 1".to_string(),
        snapshot_date: NaiveDate::from_ymd_opt(2023, 5, 8).expect("Could not parse date!"),
    };

    let resp = test::TestRequest::post()
        .uri("/api/maps/-1/versions")
        .insert_header((header::AUTHORIZATION, token))
        .set_json(new_version)
        .send_request(&app)
        .await;

    assert_eq!(resp.status(), StatusCode::CREATED);
}

#[actix_rt::test]
async fn test_can_show_versions() {
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
            diesel::insert_into(crate::schema::map_versions::table)
                .values((
                    &crate::schema::map_versions::id.eq(-1),
                    &crate::schema::map_versions::map_id.eq(-1),
                    &crate::schema::map_versions::version_name.eq("Version 1"),
                    &crate::schema::map_versions::snapshot_date
                        .eq(NaiveDate::from_ymd_opt(2023, 5, 8).expect("Could not parse date!")),
                ))
                .execute(conn)
                .await?;
            Ok(())
        }
        .scope_boxed()
    })
    .await;
    let (token, app) = init_test_app(pool.clone()).await;

    let resp = test::TestRequest::get()
        .uri("/api/maps/-1/versions?map_id=-1&per_page=10")
        .insert_header((header::AUTHORIZATION, token))
        .send_request(&app)
        .await;

    assert_eq!(resp.status(), StatusCode::OK);

    let result = test::read_body(resp).await;
    let result_string = std::str::from_utf8(&result).unwrap();
    let page: Page<MapVersionDto> = serde_json::from_str(result_string).unwrap();

    assert!(page.results.len() > 0);
}
