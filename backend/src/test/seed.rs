//! Tests for [`crate::controller::seed`].

use crate::{
    model::{
        dto::{NewSeedDto, Page, SeedDto},
        r#enum::quantity::Quantity,
    },
    test::test_utils::{init_test_app, init_test_database},
};
use actix_http::header::CONTENT_TYPE;
use actix_web::{http::StatusCode, test};
use diesel::ExpressionMethods;
use diesel_async::{scoped_futures::ScopedFutureExt, RunQueryDsl};

#[actix_rt::test]
async fn test_get_2_seeds_succeeds() {
    let pool = init_test_database(|conn| {
        async {
            diesel::insert_into(crate::schema::seeds::table)
                .values(vec![
                    (
                        &crate::schema::seeds::id.eq(-1),
                        &crate::schema::seeds::name.eq("Testia testia"),
                        &crate::schema::seeds::harvest_year.eq(2022),
                        &crate::schema::seeds::quantity.eq(Quantity::Enough),
                    ),
                    (
                        &crate::schema::seeds::id.eq(-2),
                        &crate::schema::seeds::name.eq("Testia testium"),
                        &crate::schema::seeds::harvest_year.eq(2023),
                        &crate::schema::seeds::quantity.eq(Quantity::NotEnough),
                    ),
                ])
                .execute(conn)
                .await?;
            Ok(())
        }
        .scope_boxed()
    })
    .await;
    let app = init_test_app(pool.clone()).await;

    let resp = test::TestRequest::get()
        .uri("/api/seeds")
        .send_request(&app)
        .await;

    assert_eq!(resp.status(), StatusCode::OK);
    assert_eq!(
        resp.headers().get(CONTENT_TYPE).unwrap(),
        "application/json"
    );

    let result = test::read_body(resp).await;
    let result_string = std::str::from_utf8(&result).unwrap();

    let page: Page<SeedDto> = serde_json::from_str(result_string).unwrap();
    assert_eq!(page.results.len(), 2);

    let seed_dto1 = page.results.get(0).unwrap();
    assert_eq!(seed_dto1.id, -1);
    assert_eq!(seed_dto1.name, "Testia testia".to_owned());
    assert_eq!(seed_dto1.harvest_year, 2022);
    assert_eq!(seed_dto1.quantity, Quantity::Enough);
    let seed_dto2 = page.results.get(1).unwrap();
    assert_eq!(seed_dto2.id, -2);
    assert_eq!(seed_dto2.name, "Testia testium".to_owned());
    assert_eq!(seed_dto2.harvest_year, 2023);
    assert_eq!(seed_dto2.quantity, Quantity::NotEnough);
}

#[actix_rt::test]
async fn test_find_by_id_succeeds() {
    let pool = init_test_database(|conn| {
        async {
            diesel::insert_into(crate::schema::seeds::table)
                .values(vec![
                    (
                        &crate::schema::seeds::id.eq(-1),
                        &crate::schema::seeds::name.eq("Testia testia"),
                        &crate::schema::seeds::harvest_year.eq(2022),
                        &crate::schema::seeds::quantity.eq(Quantity::Enough),
                    ),
                    (
                        &crate::schema::seeds::id.eq(-2),
                        &crate::schema::seeds::name.eq("Testia testium"),
                        &crate::schema::seeds::harvest_year.eq(2023),
                        &crate::schema::seeds::quantity.eq(Quantity::NotEnough),
                    ),
                ])
                .execute(conn)
                .await?;
            Ok(())
        }
        .scope_boxed()
    })
    .await;
    let app = init_test_app(pool.clone()).await;

    let resp = test::TestRequest::get()
        .uri("/api/seeds/-1")
        .send_request(&app)
        .await;

    assert_eq!(resp.status(), StatusCode::OK);
    assert_eq!(
        resp.headers().get(CONTENT_TYPE).unwrap(),
        "application/json"
    );

    let result = test::read_body(resp).await;
    let result_string = std::str::from_utf8(&result).unwrap();

    let seed_dto: SeedDto = serde_json::from_str(result_string).unwrap();
    assert_eq!(seed_dto.id, -1);
    assert_eq!(seed_dto.name, "Testia testia".to_owned());
    assert_eq!(seed_dto.harvest_year, 2022);
    assert_eq!(seed_dto.quantity, Quantity::Enough);
}

#[actix_rt::test]
async fn test_find_by_non_existing_id_fails() {
    let pool = init_test_database(|conn| {
        async {
            diesel::insert_into(crate::schema::seeds::table)
                .values(vec![
                    (
                        &crate::schema::seeds::id.eq(-1),
                        &crate::schema::seeds::name.eq("Testia testia"),
                        &crate::schema::seeds::harvest_year.eq(2022),
                        &crate::schema::seeds::quantity.eq(Quantity::Enough),
                    ),
                    (
                        &crate::schema::seeds::id.eq(-2),
                        &crate::schema::seeds::name.eq("Testia testium"),
                        &crate::schema::seeds::harvest_year.eq(2023),
                        &crate::schema::seeds::quantity.eq(Quantity::NotEnough),
                    ),
                ])
                .execute(conn)
                .await?;
            Ok(())
        }
        .scope_boxed()
    })
    .await;
    let app = init_test_app(pool.clone()).await;

    let resp = test::TestRequest::get()
        .uri("/api/seeds/-3")
        .send_request(&app)
        .await;

    assert_eq!(resp.status(), StatusCode::NOT_FOUND);
}

#[actix_rt::test]
async fn test_create_seed_fails_with_invalid_quantity() {
    let pool = init_test_database(|_| async { Ok(()) }.scope_boxed()).await;
    let app = init_test_app(pool.clone()).await;

    let resp = test::TestRequest::post()
        .uri("/api/seeds")
        .set_json(
            r#"{
                "name": "Tomate",
                "plant_id": 1,
                "harvest_year": 2022,
                "quantity": "Invalid"
            }"#,
        )
        .send_request(&app)
        .await;

    assert_eq!(resp.status(), StatusCode::BAD_REQUEST);
}

#[actix_rt::test]
async fn test_create_seed_fails_with_invalid_tags() {
    let pool = init_test_database(|_| async { Ok(()) }.scope_boxed()).await;
    let app = init_test_app(pool.clone()).await;

    let resp = test::TestRequest::post()
        .uri("/api/seeds")
        .set_json(
            r#"{
                "name": "Tomate",
                "plant_id": 1,
                "harvest_year": 2022,
                "quantity": "Enough"
            }"#,
        )
        .send_request(&app)
        .await;

    assert_eq!(resp.status(), StatusCode::BAD_REQUEST);
}

#[actix_rt::test]
async fn test_create_seed_fails_with_invalid_quality() {
    let pool = init_test_database(|_| async { Ok(()) }.scope_boxed()).await;
    let app = init_test_app(pool.clone()).await;

    let resp = test::TestRequest::post()
        .uri("/api/seeds")
        .set_json(
            r#"{
                "name": "Tomate",
                "plant_id": 1,
                "harvest_year": 2022,
                "quantity": "Enough",
                "quality": "Invalid"
            }"#,
        )
        .send_request(&app)
        .await;

    assert_eq!(resp.status(), StatusCode::BAD_REQUEST);
}

#[actix_rt::test]
async fn test_create_seed_ok() {
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

    let new_seed = NewSeedDto {
        name: "tomato test".to_string(),
        variety: Some("testvariety".to_string()),
        plant_id: Some(-1),
        harvest_year: 2022,
        quantity: Quantity::Nothing,
        use_by: None,
        origin: None,
        taste: None,
        yield_: None,
        generation: None,
        quality: None,
        price: None,
        notes: None,
    };

    let resp = test::TestRequest::post()
        .uri("/api/seeds")
        .set_json(new_seed)
        .send_request(&app)
        .await;
    assert_eq!(resp.status(), StatusCode::CREATED);

    let seed: SeedDto = test::read_body_json(resp).await;
    let resp = test::TestRequest::delete()
        .uri(&format!("/api/seeds/{}", seed.id))
        .send_request(&app)
        .await;

    assert_eq!(resp.status(), StatusCode::OK);
}

#[actix_rt::test]
async fn test_delete_by_id_succeeds() {
    let pool = init_test_database(|conn| {
        async {
            diesel::insert_into(crate::schema::seeds::table)
                .values((
                    &crate::schema::seeds::id.eq(-1),
                    &crate::schema::seeds::name.eq("Testia testia"),
                    &crate::schema::seeds::harvest_year.eq(2022),
                    &crate::schema::seeds::quantity.eq(Quantity::Enough),
                ))
                .execute(conn)
                .await?;
            Ok(())
        }
        .scope_boxed()
    })
    .await;
    let app = init_test_app(pool.clone()).await;

    let resp = test::TestRequest::delete()
        .uri("/api/seeds/-1")
        .send_request(&app)
        .await;

    assert_eq!(resp.status(), StatusCode::OK);
}

#[actix_rt::test]
async fn test_delete_by_non_existing_id_succeeds() {
    let pool = init_test_database(|conn| {
        async {
            diesel::insert_into(crate::schema::seeds::table)
                .values((
                    &crate::schema::seeds::id.eq(-1),
                    &crate::schema::seeds::name.eq("Testia testia"),
                    &crate::schema::seeds::harvest_year.eq(2022),
                    &crate::schema::seeds::quantity.eq(Quantity::Enough),
                ))
                .execute(conn)
                .await?;
            Ok(())
        }
        .scope_boxed()
    })
    .await;
    let app = init_test_app(pool.clone()).await;

    let resp = test::TestRequest::delete()
        .uri("/api/seeds/-2")
        .send_request(&app)
        .await;

    assert_eq!(resp.status(), StatusCode::OK);
}
