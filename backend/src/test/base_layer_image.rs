//! Tests for [`crate::controller::base_layer_image`].

use crate::model::dto::DeleteBaseLayerImageDto;
use crate::test::util::dummy_map_polygons::small_rectangle_with_non_0_xmin;
use crate::{
    error::ServiceError,
    model::{
        dto::{BaseLayerImageDto, UpdateBaseLayerImageDto},
        r#enum::{layer_type::LayerType, privacy_option::PrivacyOption},
    },
    test::util::{init_test_app, init_test_database},
};
use actix_web::{
    http::{
        header::{self, CONTENT_TYPE},
        StatusCode,
    },
    test,
};
use chrono::Utc;
use diesel::ExpressionMethods;
use diesel_async::{scoped_futures::ScopedFutureExt, AsyncPgConnection, RunQueryDsl};
use postgis_diesel::types::{Point, Polygon};
use uuid::Uuid;

async fn initial_db_values(
    conn: &mut AsyncPgConnection,
    polygon: Polygon<Point>,
) -> Result<(), ServiceError> {
    diesel::insert_into(crate::schema::maps::table)
        .values(vec![(
            &crate::schema::maps::id.eq(-1),
            &crate::schema::maps::name.eq("MyMap"),
            &crate::schema::maps::creation_date.eq(Utc::now().date_naive()),
            &crate::schema::maps::is_inactive.eq(false),
            &crate::schema::maps::zoom_factor.eq(0),
            &crate::schema::maps::honors.eq(0),
            &crate::schema::maps::visits.eq(0),
            &crate::schema::maps::harvested.eq(0),
            &crate::schema::maps::owner_id.eq(Uuid::default()),
            &crate::schema::maps::privacy.eq(PrivacyOption::Private),
            &crate::schema::maps::geometry.eq(polygon),
        )])
        .execute(conn)
        .await?;
    diesel::insert_into(crate::schema::layers::table)
        .values(vec![
            (
                &crate::schema::layers::id.eq(-1),
                &crate::schema::layers::map_id.eq(-1),
                &crate::schema::layers::type_.eq(LayerType::Base),
                &crate::schema::layers::name.eq("My Map"),
                &crate::schema::layers::is_alternative.eq(false),
            ),
            (
                &crate::schema::layers::id.eq(-2),
                &crate::schema::layers::map_id.eq(-1),
                &crate::schema::layers::type_.eq(LayerType::Base),
                &crate::schema::layers::name.eq("MyMap2"),
                &crate::schema::layers::is_alternative.eq(true),
            ),
        ])
        .execute(conn)
        .await?;
    diesel::insert_into(crate::schema::base_layer_images::table)
        .values((
            &crate::schema::base_layer_images::id.eq(Uuid::nil()),
            &crate::schema::base_layer_images::layer_id.eq(-1),
            &crate::schema::base_layer_images::path.eq(String::new()),
            &crate::schema::base_layer_images::rotation.eq(0.0),
            &crate::schema::base_layer_images::scale.eq(0.0),
        ))
        .execute(conn)
        .await?;
    Ok(())
}

#[actix_web::test]
async fn test_find_succeeds() {
    let pool = init_test_database(|conn| {
        initial_db_values(conn, small_rectangle_with_non_0_xmin()).scope_boxed()
    })
    .await;
    let (token, app) = init_test_app(pool).await;

    let resp = test::TestRequest::get()
        .uri("/api/maps/-1/layers/base/-1/images")
        .insert_header((header::AUTHORIZATION, token))
        .send_request(&app)
        .await;

    assert_eq!(resp.status(), StatusCode::OK);
    assert_eq!(
        resp.headers().get(CONTENT_TYPE).unwrap(),
        "application/json"
    );

    let results: Vec<BaseLayerImageDto> = test::read_body_json(resp).await;
    assert_eq!(results.len(), 1);
}

#[actix_web::test]
async fn test_create_succeeds() {
    let pool = init_test_database(|conn| {
        initial_db_values(conn, small_rectangle_with_non_0_xmin()).scope_boxed()
    })
    .await;
    let (token, app) = init_test_app(pool.clone()).await;

    let resp = test::TestRequest::post()
        .uri("/api/maps/-1/layers/base/images")
        .insert_header((header::AUTHORIZATION, token))
        .set_json(BaseLayerImageDto {
            id: Uuid::new_v4(),
            action_id: Uuid::new_v4(),
            layer_id: -1,
            path: "/path".to_owned(),
            rotation: 0.0,
            scale: 0.0,
        })
        .send_request(&app)
        .await;

    assert_eq!(resp.status(), StatusCode::CREATED);
}

#[actix_web::test]
async fn test_update_succeeds() {
    let pool = init_test_database(|conn| {
        initial_db_values(conn, small_rectangle_with_non_0_xmin()).scope_boxed()
    })
    .await;
    let (token, app) = init_test_app(pool.clone()).await;

    let resp = test::TestRequest::post()
        .uri(&format!(
            "/api/maps/-1/layers/base/images/{}",
            Uuid::new_v4()
        ))
        .insert_header((header::AUTHORIZATION, token))
        .set_json(UpdateBaseLayerImageDto {
            action_id: Uuid::new_v4(),
            layer_id: -2,
            path: "/path".to_owned(),
            rotation: 0.0,
            scale: 0.0,
        })
        .send_request(&app)
        .await;

    assert_eq!(resp.status(), StatusCode::NOT_FOUND);
}

#[actix_web::test]
async fn test_delete_by_id_succeeds() {
    let pool = init_test_database(|conn| {
        initial_db_values(conn, small_rectangle_with_non_0_xmin()).scope_boxed()
    })
    .await;
    let (token, app) = init_test_app(pool).await;

    let resp = test::TestRequest::delete()
        .uri(&format!("/api/maps/-1/layers/base/images/{}", Uuid::nil()))
        .insert_header((header::AUTHORIZATION, token))
        .set_json(DeleteBaseLayerImageDto {
            action_id: Uuid::new_v4(),
        })
        .send_request(&app)
        .await;

    assert_eq!(resp.status(), StatusCode::OK);
}
