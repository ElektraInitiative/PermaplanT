//! Tests for [`crate::controller::planting_suggestions`]

use crate::{
    model::{
        dto::{Page, PlantsSummaryDto},
        r#enum::{plant_spread::PlantSpread, quantity::Quantity},
    },
    test::util::{init_test_app_for_user, init_test_database},
};
use actix_web::{
    http::header::{self, CONTENT_TYPE},
    http::StatusCode,
    test,
};
use diesel::ExpressionMethods;
use diesel_async::{scoped_futures::ScopedFutureExt, RunQueryDsl};
use uuid::uuid;

/// Given a plant that is seasonal (no-data) and available (Enough)
/// and a plant that is seasonal (no-data) and not available (Nothing)
/// return only the available plant
#[actix_rt::test]
async fn test_find_only_available_plants() {
    let user_id = uuid!("00000000-0000-0000-0000-000000000000");
    let pool = init_test_database(|conn| {
        async {
            diesel::insert_into(crate::schema::plants::table)
                .values(vec![
                    (
                        // No seasonal data: plant is seasonal
                        &crate::schema::plants::id.eq(-1),
                        &crate::schema::plants::unique_name.eq("Testia testia"),
                        &crate::schema::plants::common_name_en
                            .eq(Some(vec![Some("Testplant1".to_string())])),
                        &crate::schema::plants::spread.eq(PlantSpread::Wide),
                    ),
                    (
                        // No seasonal data: plant is seasonal
                        &crate::schema::plants::id.eq(-2),
                        &crate::schema::plants::unique_name.eq("Testia testius"),
                        &crate::schema::plants::common_name_en
                            .eq(Some(vec![Some("Testplant2".to_string())])),
                        &crate::schema::plants::spread.eq(PlantSpread::Wide),
                    ),
                ])
                .execute(conn)
                .await?;

            diesel::insert_into(crate::schema::seeds::table)
                .values(vec![
                    (
                        // Available
                        &crate::schema::seeds::id.eq(-1),
                        &crate::schema::seeds::plant_id.eq(-1),
                        &crate::schema::seeds::name.eq("Testia testia"),
                        &crate::schema::seeds::harvest_year.eq(2023),
                        &crate::schema::seeds::quantity.eq(Quantity::Enough),
                        &crate::schema::seeds::owner_id.eq(user_id),
                    ),
                    (
                        // Not available
                        &crate::schema::seeds::id.eq(-2),
                        &crate::schema::seeds::plant_id.eq(-2),
                        &crate::schema::seeds::name.eq("Testia testius"),
                        &crate::schema::seeds::harvest_year.eq(2023),
                        &crate::schema::seeds::quantity.eq(Quantity::Nothing),
                        &crate::schema::seeds::owner_id.eq(user_id),
                    ),
                ])
                .execute(conn)
                .await?;
            Ok(())
        }
        .scope_boxed()
    })
    .await;
    let (token, app) = init_test_app_for_user(pool, user_id).await;

    let resp = test::TestRequest::get()
        .uri("/api/maps/1/layers/plants/suggestions?suggestion_type=available&relative_to_date=2023-01-01")
        .insert_header((header::AUTHORIZATION, token))
        .send_request(&app)
        .await;

    assert_eq!(resp.status(), StatusCode::OK);
    assert_eq!(
        resp.headers().get(CONTENT_TYPE).unwrap(),
        "application/json"
    );

    let result = test::read_body(resp).await;
    let result_string = std::str::from_utf8(&result).unwrap();

    let page: Page<PlantsSummaryDto> = serde_json::from_str(result_string).unwrap();
    assert_eq!(page.results.len(), 1);

    let test_plant = PlantsSummaryDto {
        id: -1,
        additional_name: None,
        unique_name: "Testia testia".to_string(),
        common_name_en: Some(vec![Some("Testplant1".to_string())]),
        spread: Some(PlantSpread::Wide),
    };

    assert!(page.results.contains(&test_plant));
}

/// Given a plant that is seasonal (April) and available (Enough)
/// and a plant that is not seasonal (April) and available (Enough)
/// return only the seasonal plant
#[actix_rt::test]
async fn test_find_only_available_seasonal_plants() {
    let user_id = uuid!("00000000-0000-0000-0000-000000000000");
    let pool = init_test_database(|conn| {
        async {
            diesel::insert_into(crate::schema::plants::table)
                .values(vec![
                    (
                        // plant is seasonal in april
                        &crate::schema::plants::id.eq(-1),
                        &crate::schema::plants::unique_name.eq("Testia testia"),
                        &crate::schema::plants::common_name_en
                            .eq(Some(vec![Some("Testplant1".to_string())])),
                        &crate::schema::plants::sowing_outdoors.eq(Some(vec![Some(6), Some(7)])),
                        &crate::schema::plants::spread.eq(PlantSpread::Wide),
                    ),
                    (
                        // plant is not seasonal in april
                        &crate::schema::plants::id.eq(-2),
                        &crate::schema::plants::unique_name.eq("Testia testius"),
                        &crate::schema::plants::common_name_en
                            .eq(Some(vec![Some("Testplant2".to_string())])),
                        &crate::schema::plants::sowing_outdoors.eq(Some(vec![Some(8), Some(9)])),
                        &crate::schema::plants::spread.eq(PlantSpread::Wide),
                    ),
                ])
                .execute(conn)
                .await?;

            diesel::insert_into(crate::schema::seeds::table)
                .values(vec![
                    (
                        // Available
                        &crate::schema::seeds::id.eq(-1),
                        &crate::schema::seeds::plant_id.eq(-1),
                        &crate::schema::seeds::name.eq("Testia testia"),
                        &crate::schema::seeds::harvest_year.eq(2023),
                        &crate::schema::seeds::quantity.eq(Quantity::Enough),
                        &crate::schema::seeds::owner_id.eq(user_id),
                    ),
                    (
                        // Available
                        &crate::schema::seeds::id.eq(-2),
                        &crate::schema::seeds::plant_id.eq(-2),
                        &crate::schema::seeds::name.eq("Testia testius"),
                        &crate::schema::seeds::harvest_year.eq(2023),
                        &crate::schema::seeds::quantity.eq(Quantity::Enough),
                        &crate::schema::seeds::owner_id.eq(user_id),
                    ),
                ])
                .execute(conn)
                .await?;
            Ok(())
        }
        .scope_boxed()
    })
    .await;
    let (token, app) = init_test_app_for_user(pool, user_id).await;

    let resp = test::TestRequest::get()
        .uri("/api/maps/1/layers/plants/suggestions?suggestion_type=available&relative_to_date=2023-04-01")
        .insert_header((header::AUTHORIZATION, token))
        .send_request(&app)
        .await;

    assert_eq!(resp.status(), StatusCode::OK);
    assert_eq!(
        resp.headers().get(CONTENT_TYPE).unwrap(),
        "application/json"
    );

    let result = test::read_body(resp).await;
    let result_string = std::str::from_utf8(&result).unwrap();

    let page: Page<PlantsSummaryDto> = serde_json::from_str(result_string).unwrap();
    assert_eq!(page.results.len(), 1);

    let test_plant = PlantsSummaryDto {
        id: -1,
        additional_name: None,
        unique_name: "Testia testia".to_string(),
        common_name_en: Some(vec![Some("Testplant1".to_string())]),
        spread: Some(PlantSpread::Wide),
    };

    assert!(page.results.contains(&test_plant));
}
