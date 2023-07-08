//! Tests for the heatmap on the plant layer.

use std::io::Read;

use actix_web::{
    http::{header, StatusCode},
    test,
};
use chrono::NaiveDate;
use diesel::ExpressionMethods;
use diesel_async::{scoped_futures::ScopedFutureExt, AsyncPgConnection, RunQueryDsl};
use image::load_from_memory_with_format;
use postgis_diesel::types::{Point, Polygon};
use uuid::Uuid;

use crate::{
    error::ServiceError,
    model::r#enum::{layer_type::LayerType, privacy_options::PrivacyOptions},
    test::util::{
        dummy_map_polygons::{
            rectangle_with_missing_top_left_corner, small_rectangle,
            small_rectangle_with_non_0_xmin, tall_rectangle,
        },
        init_test_app, init_test_database,
    },
};
async fn initial_db_values(
    conn: &mut AsyncPgConnection,
    polygon: Polygon<Point>,
) -> Result<(), ServiceError> {
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
            &crate::schema::maps::privacy.eq(PrivacyOptions::Public),
            &crate::schema::maps::owner_id.eq(Uuid::new_v4()),
            &crate::schema::maps::geometry.eq(polygon),
        ))
        .execute(conn)
        .await?;
    diesel::insert_into(crate::schema::layers::table)
        .values((
            &crate::schema::layers::id.eq(-1),
            &crate::schema::layers::map_id.eq(-1),
            &crate::schema::layers::type_.eq(LayerType::Plants),
            &crate::schema::layers::name.eq("Some name"),
            &crate::schema::layers::is_alternative.eq(false),
        ))
        .execute(conn)
        .await?;
    diesel::insert_into(crate::schema::plants::table)
        .values((
            &crate::schema::plants::id.eq(-1),
            &crate::schema::plants::unique_name.eq("Testia testia"),
            &crate::schema::plants::common_name_en.eq(Some(vec![Some("T".to_owned())])),
        ))
        .execute(conn)
        .await?;
    Ok(())
}

#[actix_rt::test]
async fn test_generate_heatmap_succeeds() {
    let pool =
        init_test_database(|conn| initial_db_values(conn, tall_rectangle()).scope_boxed()).await;
    let (token, app) = init_test_app(pool.clone()).await;

    let resp = test::TestRequest::get()
        .uri("/api/maps/-1/layers/plants/heatmap?plant_id=-1&layer_id=-1")
        .insert_header((header::AUTHORIZATION, token))
        .send_request(&app)
        .await;

    assert_eq!(resp.status(), StatusCode::OK);
    assert_eq!(
        resp.headers().get(header::CONTENT_TYPE),
        Some(&header::HeaderValue::from_static("image/png"))
    );
}

#[actix_rt::test]
async fn test_check_heatmap_dimensionality_succeeds() {
    let pool =
        init_test_database(|conn| initial_db_values(conn, small_rectangle()).scope_boxed()).await;
    let (token, app) = init_test_app(pool.clone()).await;

    let resp = test::TestRequest::get()
        .uri("/api/maps/-1/layers/plants/heatmap?plant_id=-1&layer_id=-1")
        .insert_header((header::AUTHORIZATION, token))
        .send_request(&app)
        .await;

    assert_eq!(resp.status(), StatusCode::OK);
    assert_eq!(
        resp.headers().get(header::CONTENT_TYPE),
        Some(&header::HeaderValue::from_static("image/png"))
    );
    let result = test::read_body(resp).await;
    let result = &result.bytes().collect::<Result<Vec<_>, _>>().unwrap();
    let image = load_from_memory_with_format(result.as_slice(), image::ImageFormat::Png).unwrap();
    let image = image.as_rgb8().unwrap();
    assert_eq!((1, 10), image.dimensions()); // smaller by factor of 10 because of granularity
}

#[actix_rt::test]
async fn test_check_heatmap_non_0_xmin_succeeds() {
    let pool = init_test_database(|conn| {
        initial_db_values(conn, small_rectangle_with_non_0_xmin()).scope_boxed()
    })
    .await;
    let (token, app) = init_test_app(pool.clone()).await;

    let resp = test::TestRequest::get()
        .uri("/api/maps/-1/layers/plants/heatmap?plant_id=-1&layer_id=-1")
        .insert_header((header::AUTHORIZATION, token))
        .send_request(&app)
        .await;

    assert_eq!(resp.status(), StatusCode::OK);
    assert_eq!(
        resp.headers().get(header::CONTENT_TYPE),
        Some(&header::HeaderValue::from_static("image/png"))
    );
    let result = test::read_body(resp).await;
    let result = &result.bytes().collect::<Result<Vec<_>, _>>().unwrap();
    let image = load_from_memory_with_format(result.as_slice(), image::ImageFormat::Png).unwrap();
    let image = image.as_rgb8().unwrap();
    assert_eq!((9, 10), image.dimensions());
}

#[actix_rt::test]
async fn test_heatmap_with_missing_corner_succeeds() {
    let pool = init_test_database(|conn| {
        initial_db_values(conn, rectangle_with_missing_top_left_corner()).scope_boxed()
    })
    .await;
    let (token, app) = init_test_app(pool.clone()).await;

    let resp = test::TestRequest::get()
        .uri("/api/maps/-1/layers/plants/heatmap?plant_id=-1&layer_id=-1")
        .insert_header((header::AUTHORIZATION, token))
        .send_request(&app)
        .await;

    assert_eq!(resp.status(), StatusCode::OK);
    assert_eq!(
        resp.headers().get(header::CONTENT_TYPE),
        Some(&header::HeaderValue::from_static("image/png"))
    );
    let result = test::read_body(resp).await;
    let result = &result.bytes().collect::<Result<Vec<_>, _>>().unwrap();
    let image = load_from_memory_with_format(result.as_slice(), image::ImageFormat::Png).unwrap();
    let image = image.as_rgb8().unwrap();
    assert_eq!((10, 10), image.dimensions());

    // Note that in images y-values are swapped, so (0,0) would be upper left.
    let lower_left_pixel = image.get_pixel(2, 8);
    let lower_right_pixel = image.get_pixel(8, 8);
    let upper_left_pixel = image.get_pixel(2, 2);
    let upper_right_pixel = image.get_pixel(8, 2);
    assert_eq!([50, 167, 20], lower_left_pixel.0);
    assert_eq!([50, 167, 20], lower_right_pixel.0);
    assert_eq!([100, 80, 40], upper_left_pixel.0);
    assert_eq!([50, 167, 20], upper_right_pixel.0);
}

#[actix_rt::test]
async fn test_missing_entities_fails() {
    let pool = init_test_database(|conn| {
        initial_db_values(conn, rectangle_with_missing_top_left_corner()).scope_boxed()
    })
    .await;
    let (token, app) = init_test_app(pool.clone()).await;

    // Invalid map id
    let resp = test::TestRequest::get()
        .uri("/api/maps/-2/layers/plants/heatmap?plant_id=-1&layer_id=-1")
        .insert_header((header::AUTHORIZATION, token.clone()))
        .send_request(&app)
        .await;
    assert_eq!(resp.status(), StatusCode::NOT_FOUND);

    // Invalid layer id
    let resp = test::TestRequest::get()
        .uri("/api/maps/-1/layers/plants/heatmap?plant_id=-2&layer_id=-1")
        .insert_header((header::AUTHORIZATION, token.clone()))
        .send_request(&app)
        .await;
    assert_eq!(resp.status(), StatusCode::INTERNAL_SERVER_ERROR);

    // Invalid plant id
    let resp = test::TestRequest::get()
        .uri("/api/maps/-1/layers/plants/heatmap?plant_id=-1&layer_id=-2")
        .insert_header((header::AUTHORIZATION, token))
        .send_request(&app)
        .await;
    assert_eq!(resp.status(), StatusCode::NOT_FOUND);
}
