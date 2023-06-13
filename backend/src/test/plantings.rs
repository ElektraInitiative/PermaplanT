//! Tests for [`crate::controller::plantings`].

use actix_http::StatusCode;
use actix_web::{http::header, test};
use chrono::NaiveDate;
use diesel::ExpressionMethods;
use diesel_async::{scoped_futures::ScopedFutureExt, RunQueryDsl};
use uuid::Uuid;

use crate::model::{
    dto::plantings::PlantingDto,
    r#enum::{layer_type::LayerType, privacy_options::PrivacyOptions},
};

use crate::test::util::{init_test_app, init_test_database};

#[actix_rt::test]
async fn test_can_search_plantings() {
    let pool = init_test_database(|conn| {
        async {
            diesel::insert_into(crate::schema::maps::table)
                .values(vec![(
                    &crate::schema::maps::id.eq(-1),
                    &crate::schema::maps::name.eq("Test Map"),
                    &crate::schema::maps::creation_date
                        .eq(NaiveDate::from_ymd_opt(2023, 5, 8).expect("Could not parse date!")),
                    &crate::schema::maps::is_inactive.eq(false),
                    &crate::schema::maps::zoom_factor.eq(100),
                    &crate::schema::maps::honors.eq(0),
                    &crate::schema::maps::visits.eq(0),
                    &crate::schema::maps::harvested.eq(0),
                    &crate::schema::maps::privacy.eq(PrivacyOptions::Public),
                    &crate::schema::maps::owner_id.eq(-1),
                )])
                .execute(conn)
                .await?;
            diesel::insert_into(crate::schema::layers::table)
                .values(vec![
                    (
                        &crate::schema::layers::id.eq(-1),
                        &crate::schema::layers::map_id.eq(-1),
                        &crate::schema::layers::type_.eq(LayerType::Plants),
                        &crate::schema::layers::name.eq("Test Layer 1"),
                        &crate::schema::layers::is_alternative.eq(false),
                    ),
                    (
                        &crate::schema::layers::id.eq(-2),
                        &crate::schema::layers::map_id.eq(-1),
                        &crate::schema::layers::type_.eq(LayerType::Plants),
                        &crate::schema::layers::name.eq("Test Layer 2"),
                        &crate::schema::layers::is_alternative.eq(true),
                    ),
                ])
                .execute(conn)
                .await?;
            diesel::insert_into(crate::schema::plants::table)
                .values(vec![(
                    &crate::schema::plants::id.eq(-1),
                    &crate::schema::plants::unique_name.eq("Testia testia"),
                    &crate::schema::plants::common_name_en
                        .eq(Some(vec![Some("Testplant".to_string())])),
                )])
                .execute(conn)
                .await?;
            diesel::insert_into(crate::schema::plantings::table)
                .values(vec![
                    (
                        &crate::schema::plantings::id.eq(Uuid::new_v4()),
                        &crate::schema::plantings::layer_id.eq(-1),
                        &crate::schema::plantings::plant_id.eq(-1),
                        &crate::schema::plantings::x.eq(0),
                        &crate::schema::plantings::y.eq(0),
                        &crate::schema::plantings::width.eq(0),
                        &crate::schema::plantings::height.eq(0),
                        &crate::schema::plantings::rotation.eq(0.0),
                        &crate::schema::plantings::scale_x.eq(0.0),
                        &crate::schema::plantings::scale_y.eq(0.0),
                    ),
                    (
                        &crate::schema::plantings::id.eq(Uuid::new_v4()),
                        &crate::schema::plantings::layer_id.eq(-2),
                        &crate::schema::plantings::plant_id.eq(-1),
                        &crate::schema::plantings::x.eq(0),
                        &crate::schema::plantings::y.eq(0),
                        &crate::schema::plantings::width.eq(0),
                        &crate::schema::plantings::height.eq(0),
                        &crate::schema::plantings::rotation.eq(0.0),
                        &crate::schema::plantings::scale_x.eq(0.0),
                        &crate::schema::plantings::scale_y.eq(0.0),
                    ),
                ])
                .execute(conn)
                .await?;
            Ok(())
        }
        .scope_boxed()
    })
    .await;
    let (token, app) = init_test_app(pool.clone()).await;

    let resp = test::TestRequest::get()
        .uri("/api/maps/-1/layers/plants/plantings?plants_layer_id=-1")
        .insert_header((header::AUTHORIZATION, token.clone()))
        .send_request(&app)
        .await;
    assert_eq!(resp.status(), StatusCode::OK);

    let results: Vec<PlantingDto> = test::read_body_json(resp).await;
    assert_eq!(results.len(), 1);

    let resp = test::TestRequest::get()
        .uri("/api/maps/-1/layers/plants/plantings")
        .insert_header((header::AUTHORIZATION, token))
        .send_request(&app)
        .await;
    assert_eq!(resp.status(), StatusCode::OK);

    let results: Vec<PlantingDto> = test::read_body_json(resp).await;
    assert_eq!(results.len(), 2);
}
