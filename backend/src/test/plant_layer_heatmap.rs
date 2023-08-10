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
    model::r#enum::{
        layer_type::LayerType, light_requirement::LightRequirement, privacy_option::PrivacyOption,
        relation_type::RelationType, shade::Shade,
    },
    test::util::{
        data,
        dummy_map_polygons::{
            rectangle_with_missing_bottom_left_corner, small_rectangle,
            small_rectangle_with_non_0_xmin, small_square, tall_rectangle,
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
            &crate::schema::maps::privacy.eq(PrivacyOption::Public),
            &crate::schema::maps::owner_id.eq(Uuid::new_v4()),
            &crate::schema::maps::geometry.eq(polygon),
        ))
        .execute(conn)
        .await?;
    diesel::insert_into(crate::schema::layers::table)
        .values(vec![
            (
                &crate::schema::layers::id.eq(-1),
                &crate::schema::layers::map_id.eq(-1),
                &crate::schema::layers::type_.eq(LayerType::Plants),
                &crate::schema::layers::name.eq("Some name"),
                &crate::schema::layers::is_alternative.eq(false),
            ),
            (
                &crate::schema::layers::id.eq(-2),
                &crate::schema::layers::map_id.eq(-1),
                &crate::schema::layers::type_.eq(LayerType::Shade),
                &crate::schema::layers::name.eq("Some name"),
                &crate::schema::layers::is_alternative.eq(false),
            ),
        ])
        .execute(conn)
        .await?;
    diesel::insert_into(crate::schema::plants::table)
        .values((
            &crate::schema::plants::id.eq(-1),
            &crate::schema::plants::unique_name.eq("Testia testia"),
            &crate::schema::plants::common_name_en.eq(Some(vec![Some("T".to_owned())])),
            &crate::schema::plants::shade.eq(Some(Shade::NoShade)),
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
        .uri("/api/maps/-1/layers/plants/heatmap?plant_id=-1&plant_layer_id=-1&shade_layer_id=-2")
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
        .uri("/api/maps/-1/layers/plants/heatmap?plant_id=-1&plant_layer_id=-1&shade_layer_id=-2")
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
    let image = image.as_rgba8().unwrap();
    assert_eq!((10, 100), image.dimensions());
}

#[actix_rt::test]
async fn test_check_heatmap_non_0_xmin_succeeds() {
    let pool = init_test_database(|conn| {
        initial_db_values(conn, small_rectangle_with_non_0_xmin()).scope_boxed()
    })
    .await;
    let (token, app) = init_test_app(pool.clone()).await;

    let resp = test::TestRequest::get()
        .uri("/api/maps/-1/layers/plants/heatmap?plant_id=-1&plant_layer_id=-1&shade_layer_id=-2")
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
    let image = image.as_rgba8().unwrap();
    assert_eq!((90, 100), image.dimensions());
}

/// Test with a map geometry that excludes a corner.
/// The missing corner should be transparent, as you cannot put plants there.
#[actix_rt::test]
async fn test_heatmap_with_missing_corner_succeeds() {
    let pool = init_test_database(|conn| {
        initial_db_values(conn, rectangle_with_missing_bottom_left_corner()).scope_boxed()
    })
    .await;
    let (token, app) = init_test_app(pool.clone()).await;

    let resp = test::TestRequest::get()
        .uri("/api/maps/-1/layers/plants/heatmap?plant_id=-1&plant_layer_id=-1&shade_layer_id=-2")
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
    let image = image.as_rgba8().unwrap();

    // (0,0) is be top left.
    let (x_dim, y_dim) = image.dimensions();
    let top_left_pixel = image.get_pixel(0, 0);
    let top_right_pixel = image.get_pixel(x_dim - 1, 0);
    let bottom_left_pixel = image.get_pixel(0, y_dim - 1);
    let bottom_right_pixel = image.get_pixel(x_dim - 1, y_dim - 1);
    assert_eq!([68, 186, 0, 0], top_left_pixel.0);
    assert_eq!([68, 186, 0, 0], top_right_pixel.0);
    assert_eq!([255, 0, 0, 0], bottom_left_pixel.0);
    assert_eq!([68, 186, 0, 0], bottom_right_pixel.0);
}

#[actix_rt::test]
async fn test_heatmap_with_shadings_succeeds() {
    let pool = init_test_database(|conn| {
        async {
            initial_db_values(conn, tall_rectangle()).await?;
            diesel::insert_into(crate::schema::shadings::table)
                .values((
                    &crate::schema::shadings::id.eq(Uuid::new_v4()),
                    &crate::schema::shadings::layer_id.eq(-2),
                    &crate::schema::shadings::shade.eq(Shade::PermanentDeepShade),
                    &crate::schema::shadings::geometry.eq(small_square()),
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
        .uri("/api/maps/-1/layers/plants/heatmap?plant_id=-1&plant_layer_id=-1&shade_layer_id=-2")
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
    let image = image.as_rgba8().unwrap();

    // (0,0) is be top left.
    let (x_dim, y_dim) = image.dimensions();
    let top_left_pixel = image.get_pixel(0, 0);
    let bottom_right_pixel = image.get_pixel(x_dim - 1, y_dim - 1);
    // The shading is the exact opposite of the plants preference, therefore the map will be red.
    assert_eq!([186, 68, 0, 0], top_left_pixel.0);
    // Plant like other positions, therefore green.
    assert_eq!([68, 186, 0, 0], bottom_right_pixel.0);
}

#[actix_rt::test]
async fn test_heatmap_with_shadings_and_light_requirement_succeeds() {
    let pool = init_test_database(|conn| {
        async {
            initial_db_values(conn, tall_rectangle()).await?;
            diesel::insert_into(crate::schema::plants::table)
                .values(vec![
                    (
                        &crate::schema::plants::id.eq(-2),
                        &crate::schema::plants::unique_name.eq("Testia"),
                        &crate::schema::plants::common_name_en.eq(Some(vec![Some("T".to_owned())])),
                        &crate::schema::plants::shade.eq(Some(Shade::PermanentDeepShade)),
                        &crate::schema::plants::light_requirement
                            .eq(Some(vec![Some(LightRequirement::FullShade)])),
                    ),
                    (
                        &crate::schema::plants::id.eq(-3),
                        &crate::schema::plants::unique_name.eq("Testia testum"),
                        &crate::schema::plants::common_name_en.eq(Some(vec![Some("T".to_owned())])),
                        &crate::schema::plants::shade.eq(Some(Shade::LightShade)),
                        &crate::schema::plants::light_requirement.eq(Some(vec![
                            Some(LightRequirement::Full),
                            Some(LightRequirement::Partial),
                        ])),
                    ),
                ])
                .execute(conn)
                .await?;
            diesel::insert_into(crate::schema::shadings::table)
                .values((
                    &crate::schema::shadings::id.eq(Uuid::new_v4()),
                    &crate::schema::shadings::layer_id.eq(-2),
                    &crate::schema::shadings::shade.eq(Shade::PermanentDeepShade),
                    &crate::schema::shadings::geometry.eq(small_square()),
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
        .uri("/api/maps/-1/layers/plants/heatmap?plant_id=-2&plant_layer_id=-1&shade_layer_id=-2")
        .insert_header((header::AUTHORIZATION, token.clone()))
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
    let image = image.as_rgba8().unwrap();

    // (0,0) is be top left.
    let (x_dim, y_dim) = image.dimensions();
    let top_left_pixel = image.get_pixel(0, 0);
    let bottom_right_pixel = image.get_pixel(x_dim - 1, y_dim - 1);
    // The shading is deep shade with is ok for the plant.
    assert_eq!([68, 186, 0, 0], top_left_pixel.0);
    // The plant can't grow in sun.
    assert_eq!([255, 0, 0, 255], bottom_right_pixel.0);

    let resp = test::TestRequest::get()
        .uri("/api/maps/-1/layers/plants/heatmap?plant_id=-3&plant_layer_id=-1&shade_layer_id=-2")
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
    let image = image.as_rgba8().unwrap();

    // (0,0) is be top left.
    let (x_dim, y_dim) = image.dimensions();
    let top_left_pixel = image.get_pixel(0, 0);
    let bottom_right_pixel = image.get_pixel(x_dim - 1, y_dim - 1);
    // The plant can't grow in deep shade.
    assert_eq!([255, 0, 0, 255], top_left_pixel.0);
    // The plant can grow in sun.
    assert_eq!([127, 127, 0, 0], bottom_right_pixel.0);
}

#[actix_rt::test]
async fn test_heatmap_with_plantings_succeeds() {
    let pool = init_test_database(|conn| {
        async {
            initial_db_values(conn, tall_rectangle()).await?;
            diesel::insert_into(crate::schema::plants::table)
                .values((
                    &crate::schema::plants::id.eq(-2),
                    &crate::schema::plants::unique_name.eq("Testia"),
                    &crate::schema::plants::common_name_en.eq(Some(vec![Some("T".to_owned())])),
                ))
                .execute(conn)
                .await?;
            diesel::insert_into(crate::schema::relations::table)
                .values(vec![(
                    &crate::schema::relations::plant1.eq(-1),
                    &crate::schema::relations::plant2.eq(-2),
                    &crate::schema::relations::relation.eq(RelationType::Companion),
                )])
                .execute(conn)
                .await?;
            diesel::insert_into(crate::schema::plantings::table)
                .values(vec![data::TestInsertablePlanting {
                    id: Uuid::new_v4(),
                    layer_id: -1,
                    plant_id: -1,
                    x: 0,
                    y: 0,
                    ..Default::default()
                }])
                .execute(conn)
                .await?;
            Ok(())
        }
        .scope_boxed()
    })
    .await;
    let (token, app) = init_test_app(pool.clone()).await;

    let resp = test::TestRequest::get()
        .uri("/api/maps/-1/layers/plants/heatmap?plant_id=-2&plant_layer_id=-1&shade_layer_id=-2")
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
    let image = image.as_rgba8().unwrap();

    let (x_dim, y_dim) = image.dimensions();
    let on_planting = image.get_pixel(0, 0);
    let close_to_planting = image.get_pixel(1, 1);
    let far_away_from_planting = image.get_pixel(x_dim - 1, y_dim - 1);
    // The planting influences the map.
    assert!(on_planting.0[0] <= close_to_planting.0[0]);
    assert!(on_planting.0[1] >= close_to_planting.0[1]);
    assert!(on_planting.0[3] >= close_to_planting.0[3]);
    // There is no influence on locations far away.
    assert_eq!([127, 127, 0, 0], far_away_from_planting.0);
}

#[actix_rt::test]
async fn test_heatmap_with_deleted_planting_succeeds() {
    let pool = init_test_database(|conn| {
        async {
            initial_db_values(conn, tall_rectangle()).await?;
            diesel::insert_into(crate::schema::plants::table)
                .values((
                    &crate::schema::plants::id.eq(-2),
                    &crate::schema::plants::unique_name.eq("Testia"),
                    &crate::schema::plants::common_name_en.eq(Some(vec![Some("T".to_owned())])),
                ))
                .execute(conn)
                .await?;
            diesel::insert_into(crate::schema::relations::table)
                .values(vec![(
                    &crate::schema::relations::plant1.eq(-1),
                    &crate::schema::relations::plant2.eq(-2),
                    &crate::schema::relations::relation.eq(RelationType::Companion),
                )])
                .execute(conn)
                .await?;
            diesel::insert_into(crate::schema::plantings::table)
                .values(vec![data::TestInsertablePlanting {
                    id: Uuid::new_v4(),
                    layer_id: -1,
                    plant_id: -1,
                    x: 0,
                    y: 0,
                    remove_date: Some(NaiveDate::from_ymd_opt(2023, 07, 30).unwrap()),
                    ..Default::default()
                }])
                .execute(conn)
                .await?;
            Ok(())
        }
        .scope_boxed()
    })
    .await;
    let (token, app) = init_test_app(pool.clone()).await;

    let resp = test::TestRequest::get()
        .uri("/api/maps/-1/layers/plants/heatmap?plant_id=-2&plant_layer_id=-1&shade_layer_id=-2")
        .insert_header((header::AUTHORIZATION, token.clone()))
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
    let image = image.as_rgba8().unwrap();

    let (x_dim, y_dim) = image.dimensions();
    let on_planting = image.get_pixel(0, 0);
    let close_to_planting = image.get_pixel(1, 1);
    let far_away_from_planting = image.get_pixel(x_dim - 1, y_dim - 1);
    // The planting doesn't influences the map as it is deleted.
    assert_eq!([127, 127, 0, 0], on_planting.0);
    assert_eq!([127, 127, 0, 0], close_to_planting.0);
    assert_eq!([127, 127, 0, 0], far_away_from_planting.0);

    let resp = test::TestRequest::get()
        .uri("/api/maps/-1/layers/plants/heatmap?plant_id=-2&plant_layer_id=-1&shade_layer_id=-2&date=2023-07-21")
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
    let image_rgba8 = image.as_rgba8().unwrap();

    let on_planting = image_rgba8.get_pixel(0, 0);
    let close_to_planting = image_rgba8.get_pixel(1, 1);
    // The planting influences the map as we set the date back in the query.
    assert!(on_planting.0[0] <= close_to_planting.0[0]);
    assert!(on_planting.0[1] >= close_to_planting.0[1]);
    assert!(on_planting.0[3] >= close_to_planting.0[3]);
}

#[actix_rt::test]
async fn test_missing_entities_fails() {
    let pool = init_test_database(|conn| {
        initial_db_values(conn, rectangle_with_missing_bottom_left_corner()).scope_boxed()
    })
    .await;
    let (token, app) = init_test_app(pool.clone()).await;

    // Invalid map id
    let resp = test::TestRequest::get()
        .uri("/api/maps/-2/layers/plants/heatmap?plant_id=-1&plant_layer_id=-1&shade_layer_id=-2")
        .insert_header((header::AUTHORIZATION, token.clone()))
        .send_request(&app)
        .await;
    assert_eq!(resp.status(), StatusCode::NOT_FOUND);

    // Invalid plant id
    let resp = test::TestRequest::get()
        .uri("/api/maps/-1/layers/plants/heatmap?plant_id=-2&plant_layer_id=-1&shade_layer_id=-2")
        .insert_header((header::AUTHORIZATION, token.clone()))
        .send_request(&app)
        .await;
    assert_eq!(resp.status(), StatusCode::INTERNAL_SERVER_ERROR);

    // Invalid plant layer id
    let resp = test::TestRequest::get()
        .uri("/api/maps/-1/layers/plants/heatmap?plant_id=-2&plant_layer_id=-5&shade_layer_id=-2")
        .insert_header((header::AUTHORIZATION, token.clone()))
        .send_request(&app)
        .await;
    assert_eq!(resp.status(), StatusCode::NOT_FOUND);

    // Invalid shade layer id
    let resp = test::TestRequest::get()
        .uri("/api/maps/-1/layers/plants/heatmap?plant_id=-1&plant_layer_id=-1&shade_layer_id=-5")
        .insert_header((header::AUTHORIZATION, token))
        .send_request(&app)
        .await;
    assert_eq!(resp.status(), StatusCode::NOT_FOUND);
}
