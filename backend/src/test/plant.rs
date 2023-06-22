//! Tests for [`crate::controller::plants`].

use crate::{
    model::{
        dto::{Page, PlantsSummaryDto, RelationsDto},
        r#enum::relations_type::RelationsType,
    },
    test::util::{init_test_app, init_test_database},
};
use actix_web::{
    http::header::{self, CONTENT_TYPE},
    http::StatusCode,
    test,
};
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
    let (token, app) = init_test_app(pool.clone()).await;

    let resp = test::TestRequest::get()
        .uri("/api/plants")
        .insert_header((header::AUTHORIZATION, token))
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
    let (token, app) = init_test_app(pool.clone()).await;

    let resp = test::TestRequest::get()
        .uri("/api/plants/-1")
        .insert_header((header::AUTHORIZATION, token))
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
    let (token, app) = init_test_app(pool.clone()).await;

    let resp = test::TestRequest::get()
        .uri("/api/plants?name=Testplant&per_page=10")
        .insert_header((header::AUTHORIZATION, token))
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
async fn test_find_plants_relations_succeeds() {
    let pool = init_test_database(|conn| {
        async {
            diesel::insert_into(crate::schema::plants::table)
                .values(vec![
                    (
                        &crate::schema::plants::id.eq(-1),
                        &crate::schema::plants::unique_name.eq("Testia testia"),
                    ),
                    (
                        &crate::schema::plants::id.eq(-2),
                        &crate::schema::plants::unique_name.eq("Testia 2"),
                    ),
                    (
                        &crate::schema::plants::id.eq(-3),
                        &crate::schema::plants::unique_name.eq("Test"),
                    ),
                    (
                        &crate::schema::plants::id.eq(-4),
                        &crate::schema::plants::unique_name.eq("Testia testum"),
                    ),
                ])
                .execute(conn)
                .await?;
            diesel::insert_into(crate::schema::relations::table)
                .values(vec![
                    (
                        &crate::schema::relations::plant1.eq("Testia testia"),
                        &crate::schema::relations::plant2.eq("Test"),
                        &crate::schema::relations::relation.eq(RelationsType::Companion),
                    ),
                    (
                        &crate::schema::relations::plant1.eq("Testia 2"),
                        &crate::schema::relations::plant2.eq("Testia 2"),
                        &crate::schema::relations::relation.eq(RelationsType::Antagonist),
                    ),
                    (
                        &crate::schema::relations::plant1.eq("Testia testum"),
                        &crate::schema::relations::plant2.eq("Testia 2"),
                        &crate::schema::relations::relation.eq(RelationsType::Companion),
                    ),
                    (
                        &crate::schema::relations::plant1.eq("Test"),
                        &crate::schema::relations::plant2.eq("Testia 2"),
                        &crate::schema::relations::relation.eq(RelationsType::Neutral),
                    ),
                    (
                        // Same as the one above but switched (to test if return value is distinct)
                        &crate::schema::relations::plant1.eq("Testia 2"),
                        &crate::schema::relations::plant2.eq("Test"),
                        &crate::schema::relations::relation.eq(RelationsType::Neutral),
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
        .uri("/api/plants/relations?plant_id=-3")
        .insert_header((header::AUTHORIZATION, token.clone()))
        .send_request(&app)
        .await;
    assert_eq!(resp.status(), StatusCode::OK);
    let result = test::read_body(resp).await;
    let result_string = std::str::from_utf8(&result).unwrap();
    let dto: RelationsDto = serde_json::from_str(result_string).unwrap();
    assert!(dto.id == -3);
    assert!(dto.relations.len() == 2);

    let resp = test::TestRequest::get()
        .uri("/api/plants/relations?plant_id=-2")
        .insert_header((header::AUTHORIZATION, token))
        .send_request(&app)
        .await;
    assert_eq!(resp.status(), StatusCode::OK);
    let result = test::read_body(resp).await;
    let result_string = std::str::from_utf8(&result).unwrap();
    let dto: RelationsDto = serde_json::from_str(result_string).unwrap();
    assert!(dto.id == -2);
    assert!(dto.relations.len() == 3);
}
