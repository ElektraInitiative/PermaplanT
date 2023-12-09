//! Tests for [`crate::controller::map`].

use crate::model::dto::UpdateMapGeometryDto;
use crate::test::util::dummy_map_polygons::small_rectangle;
use crate::{
    model::{
        dto::{MapDto, NewMapDto, Page, UpdateMapDto},
        r#enum::privacy_option::PrivacyOption,
    },
    test::util::{dummy_map_polygons::tall_rectangle, init_test_app, init_test_database},
};
use actix_web::{
    http::{header, StatusCode},
    test,
};
use chrono::NaiveDate;
use diesel::ExpressionMethods;
use diesel_async::{scoped_futures::ScopedFutureExt, RunQueryDsl};
use uuid::Uuid;

#[actix_rt::test]
async fn test_can_search_maps() {
    let pool = init_test_database(|conn| {
        async {
            diesel::insert_into(crate::schema::maps::table)
                .values(vec![(
                    &crate::schema::maps::id.eq(-1),
                    &crate::schema::maps::name.eq("Test Map: can find map"),
                    &crate::schema::maps::creation_date
                        .eq(NaiveDate::from_ymd_opt(2023, 5, 8).expect("Could not parse date!")),
                    &crate::schema::maps::is_inactive.eq(false),
                    &crate::schema::maps::zoom_factor.eq(100),
                    &crate::schema::maps::honors.eq(0),
                    &crate::schema::maps::visits.eq(0),
                    &crate::schema::maps::harvested.eq(0),
                    &crate::schema::maps::privacy.eq(PrivacyOption::Public),
                    &crate::schema::maps::owner_id.eq(Uuid::new_v4()),
                    &crate::schema::maps::geometry.eq(tall_rectangle()),
                ),(
                    &crate::schema::maps::id.eq(-2),
                    &crate::schema::maps::name.eq("Other"),
                    &crate::schema::maps::creation_date
                        .eq(NaiveDate::from_ymd_opt(2023, 5, 8).expect("Could not parse date!")),
                    &crate::schema::maps::is_inactive.eq(false),
                    &crate::schema::maps::zoom_factor.eq(100),
                    &crate::schema::maps::honors.eq(0),
                    &crate::schema::maps::visits.eq(0),
                    &crate::schema::maps::harvested.eq(0),
                    &crate::schema::maps::privacy.eq(PrivacyOption::Public),
                    &crate::schema::maps::owner_id.eq(Uuid::new_v4()),
                    &crate::schema::maps::geometry.eq(tall_rectangle()),
                )])
                .execute(conn)
                .await?;
            Ok(())
        }
        .scope_boxed()
    })
    .await;
    let (token, app) = init_test_app(pool.clone()).await;

    let resp = test::TestRequest::get()
        .uri("/api/maps")
        .insert_header((header::AUTHORIZATION, token.clone()))
        .send_request(&app)
        .await;

    assert_eq!(resp.status(), StatusCode::OK);

    let result = test::read_body(resp).await;
    let result_string = std::str::from_utf8(&result).unwrap();
    let page: Page<MapDto> = serde_json::from_str(result_string).unwrap();

    assert!(page.results.len() == 2);

    let resp = test::TestRequest::get()
        .uri("/api/maps?name=Other")
        .insert_header((header::AUTHORIZATION, token))
        .send_request(&app)
        .await;

    assert_eq!(resp.status(), StatusCode::OK);

    let result = test::read_body(resp).await;
    let result_string = std::str::from_utf8(&result).unwrap();
    let page: Page<MapDto> = serde_json::from_str(result_string).unwrap();

    assert!(page.results.len() == 1);
}

#[actix_rt::test]
async fn test_can_find_map_by_id() {
    let pool = init_test_database(|conn| {
        async {
            diesel::insert_into(crate::schema::maps::table)
                .values((
                    &crate::schema::maps::id.eq(-1),
                    &crate::schema::maps::name.eq("Test Map: can search map"),
                    &crate::schema::maps::creation_date
                        .eq(NaiveDate::from_ymd_opt(2023, 5, 8).expect("Could not parse date!")),
                    &crate::schema::maps::is_inactive.eq(false),
                    &crate::schema::maps::zoom_factor.eq(100),
                    &crate::schema::maps::honors.eq(0),
                    &crate::schema::maps::visits.eq(0),
                    &crate::schema::maps::harvested.eq(0),
                    &crate::schema::maps::privacy.eq(PrivacyOption::Public),
                    &crate::schema::maps::owner_id.eq(Uuid::new_v4()),
                    &crate::schema::maps::geometry.eq(tall_rectangle()),
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
async fn test_can_create_map() {
    let pool = init_test_database(|_| async { Ok(()) }.scope_boxed()).await;
    let (token, app) = init_test_app(pool.clone()).await;

    let new_map = NewMapDto {
        name: "Test Map: can create map".to_string(),
        creation_date: NaiveDate::from_ymd_opt(2023, 5, 8).expect("Could not parse date!"),
        deletion_date: None,
        last_visit: None,
        is_inactive: false,
        zoom_factor: 100,
        honors: 0,
        visits: 0,
        harvested: 0,
        privacy: PrivacyOption::Public,
        description: None,
        location: None,
        geometry: tall_rectangle(),
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
async fn test_update_fails_for_not_owner() {
    let pool = init_test_database(|conn| {
        async {
            diesel::insert_into(crate::schema::maps::table)
                .values((
                    &crate::schema::maps::id.eq(-1),
                    &crate::schema::maps::name.eq("Test Map: no update permission"),
                    &crate::schema::maps::creation_date
                        .eq(NaiveDate::from_ymd_opt(2023, 5, 8).expect("Could not parse date!")),
                    &crate::schema::maps::is_inactive.eq(false),
                    &crate::schema::maps::zoom_factor.eq(100),
                    &crate::schema::maps::honors.eq(0),
                    &crate::schema::maps::visits.eq(0),
                    &crate::schema::maps::harvested.eq(0),
                    &crate::schema::maps::privacy.eq(PrivacyOption::Public),
                    &crate::schema::maps::owner_id.eq(Uuid::new_v4()),
                    &crate::schema::maps::geometry.eq(tall_rectangle()),
                ))
                .execute(conn)
                .await?;
            Ok(())
        }
        .scope_boxed()
    })
    .await;
    let (token, app) = init_test_app(pool.clone()).await;

    let map_update = UpdateMapDto {
        name: Some("This will fail".to_string()),
        privacy: None,
        description: None,
        location: None,
    };

    let resp = test::TestRequest::patch()
        .uri("/api/maps/-1")
        .insert_header((header::AUTHORIZATION, token))
        .set_json(map_update)
        .send_request(&app)
        .await;
    assert_eq!(resp.status(), StatusCode::FORBIDDEN);
}

#[actix_rt::test]
async fn test_can_update_map() {
    let pool = init_test_database(|_| async { Ok(()) }.scope_boxed()).await;
    let (token, app) = init_test_app(pool.clone()).await;

    let new_map = NewMapDto {
        name: "Test Map: can update map".to_string(),
        creation_date: NaiveDate::from_ymd_opt(2023, 5, 8).expect("Could not parse date!"),
        deletion_date: None,
        last_visit: None,
        is_inactive: false,
        zoom_factor: 100,
        honors: 0,
        visits: 0,
        harvested: 0,
        privacy: PrivacyOption::Public,
        description: None,
        location: None,
        geometry: tall_rectangle(),
    };

    let resp = test::TestRequest::post()
        .uri("/api/maps")
        .insert_header((header::AUTHORIZATION, token.clone()))
        .set_json(new_map)
        .send_request(&app)
        .await;
    let map: MapDto = test::read_body_json(resp).await;

    let map_update = UpdateMapDto {
        name: Some("This will succeed".to_string()),
        privacy: None,
        description: None,
        location: None,
    };

    let resp = test::TestRequest::patch()
        .uri(&format!("/api/maps/{}", map.id))
        .insert_header((header::AUTHORIZATION, token))
        .set_json(map_update)
        .send_request(&app)
        .await;

    let updated_map: MapDto = test::read_body_json(resp).await;
    assert_ne!(updated_map.name, map.name)
}
#[actix_rt::test]
async fn test_can_update_map_geometry() {
    let pool = init_test_database(|_| async { Ok(()) }.scope_boxed()).await;
    let (token, app) = init_test_app(pool.clone()).await;

    let new_map = NewMapDto {
        name: "Test Map: can update map geomety".to_string(),
        creation_date: NaiveDate::from_ymd_opt(2023, 5, 8).expect("Could not parse date!"),
        deletion_date: None,
        last_visit: None,
        is_inactive: false,
        zoom_factor: 100,
        honors: 0,
        visits: 0,
        harvested: 0,
        privacy: PrivacyOption::Public,
        description: None,
        location: None,
        geometry: tall_rectangle(),
    };

    let resp = test::TestRequest::post()
        .uri("/api/maps")
        .insert_header((header::AUTHORIZATION, token.clone()))
        .set_json(new_map)
        .send_request(&app)
        .await;
    let map: MapDto = test::read_body_json(resp).await;

    let map_update_geometry = UpdateMapGeometryDto {
        geometry: small_rectangle(),
    };

    let resp = test::TestRequest::patch()
        .uri(&format!("/api/maps/{}/geometry", map.id))
        .insert_header((header::AUTHORIZATION, token))
        .set_json(map_update_geometry)
        .send_request(&app)
        .await;

    let updated_map: MapDto = test::read_body_json(resp).await;
    assert_ne!(updated_map.geometry, map.geometry)
}
