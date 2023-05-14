//! Tests for [`crate::controller::plants`].

use crate::{
    model::dto::{Page, PlantsSummaryDto},
    test::test_utils::{init_test_app, init_test_database},
};
use actix_web::{http::header::CONTENT_TYPE, http::StatusCode, test};
use diesel::ExpressionMethods;
use diesel_async::{scoped_futures::ScopedFutureExt, RunQueryDsl};

#[actix_rt::test]
async fn test_get_all_plants_succeeds() {
    let pool = init_test_database(|conn| {
        async {
            diesel::insert_into(crate::schema::plants::table)
                .values((
                    &crate::schema::plants::id.eq(-1),
                    &crate::schema::plants::unique_name.eq("Testia testia"),
                    &crate::schema::plants::common_name_en
                        .eq(Some(vec![Some("Testplant".to_string())])),
                ))
                .execute(conn)
                .await?;
            Ok(())
        }
        .scope_boxed()
    })
    .await;
    let app = init_test_app(pool.clone()).await;

    let resp = test::TestRequest::get()
        .uri("/api/plants")
        .send_request(&app)
        .await;

    assert_eq!(resp.status(), StatusCode::OK);

    assert_eq!(
        resp.headers().get(CONTENT_TYPE).unwrap(),
        "application/json"
    );

    let test_plant = PlantsSummaryDto {
        id: -1,
        unique_name: "Testia testia".to_string(),
        common_name_en: Some(vec![Some("Testplant".to_string())]),
    };

    let result = test::read_body(resp).await;
    let result_string = std::str::from_utf8(&result).unwrap();

    let page: Page<PlantsSummaryDto> = serde_json::from_str(result_string).unwrap();

    assert!(page.results.contains(&test_plant));
}

#[actix_rt::test]
async fn test_get_one_plant_succeeds() {
    let pool = init_test_database(|conn| {
        async {
            diesel::insert_into(crate::schema::plants::table)
                .values((
                    &crate::schema::plants::id.eq(-1),
                    &crate::schema::plants::unique_name.eq("Testia testia"),
                    &crate::schema::plants::common_name_en
                        .eq(Some(vec![Some("Testplant".to_string())])),
                ))
                .execute(conn)
                .await?;
            Ok(())
        }
        .scope_boxed()
    })
    .await;
    let app = init_test_app(pool.clone()).await;

    let resp = test::TestRequest::get()
        .uri("/api/plants/-1")
        .send_request(&app)
        .await;

    assert_eq!(resp.status(), StatusCode::OK);

    assert_eq!(
        resp.headers().get(CONTENT_TYPE).unwrap(),
        "application/json"
    );

    let test_plant = PlantsSummaryDto {
        id: -1,
        unique_name: "Testia testia".to_string(),
        common_name_en: Some(vec![Some("Testplant".to_string())]),
    };

    let result = test::read_body(resp).await;
    let result_string = std::str::from_utf8(&result).unwrap();

    let dto: PlantsSummaryDto = serde_json::from_str(result_string).unwrap();

    assert_eq!(dto, test_plant);
}

#[actix_rt::test]
async fn test_search_plants_succeeds() {
    let pool = init_test_database(|conn| {
        async {
            diesel::insert_into(crate::schema::plants::table)
                .values((
                    &crate::schema::plants::id.eq(-1),
                    &crate::schema::plants::unique_name.eq("Testia testia"),
                    &crate::schema::plants::common_name_en
                        .eq(Some(vec![Some("Testplant".to_string())])),
                ))
                .execute(conn)
                .await?;
            Ok(())
        }
        .scope_boxed()
    })
    .await;
    let app = init_test_app(pool.clone()).await;

    let resp = test::TestRequest::get()
        .uri("/api/plants?name=Testplant&per_page=10")
        .send_request(&app)
        .await;

    assert_eq!(resp.status(), StatusCode::OK);

    assert_eq!(
        resp.headers().get(CONTENT_TYPE).unwrap(),
        "application/json"
    );

    let test_plant = PlantsSummaryDto {
        id: -1,
        unique_name: "Testia testia".to_string(),
        common_name_en: Some(vec![Some("Testplant".to_string())]),
    };

    let result = test::read_body(resp).await;
    let result_string = std::str::from_utf8(&result).unwrap();

    let page: Page<PlantsSummaryDto> = serde_json::from_str(result_string).unwrap();

    assert!(page.results.contains(&test_plant));
}
