//! Tests for [`crate::controller::seed`].

use crate::model::dto::ArchiveSeedDto;
use crate::{
    model::{
        dto::{NewSeedDto, Page, SeedDto},
        r#enum::quantity::Quantity,
    },
    test::util::{init_test_app, init_test_app_for_user, init_test_database},
};
use actix_web::{
    http::{
        header::{self, CONTENT_TYPE},
        StatusCode,
    },
    test,
};
use chrono::NaiveDate;
use diesel::ExpressionMethods;
use diesel_async::{scoped_futures::ScopedFutureExt, RunQueryDsl};
use uuid::uuid;

#[actix_rt::test]
async fn test_find_two_seeds_succeeds() {
    let user_id = uuid!("00000000-0000-0000-0000-000000000000");
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

            diesel::insert_into(crate::schema::seeds::table)
                .values(vec![
                    (
                        &crate::schema::seeds::id.eq(-1),
                        &crate::schema::seeds::name.eq("Testia testia"),
                        &crate::schema::seeds::harvest_year.eq(2022),
                        &crate::schema::seeds::quantity.eq(Quantity::Enough),
                        &crate::schema::seeds::owner_id.eq(user_id),
                        &crate::schema::seeds::plant_id.eq(-1),
                        &crate::schema::seeds::use_by.eq(NaiveDate::from_ymd_opt(2023, 01, 01)),
                    ),
                    (
                        &crate::schema::seeds::id.eq(-2),
                        &crate::schema::seeds::name.eq("Testia testium"),
                        &crate::schema::seeds::harvest_year.eq(2022),
                        &crate::schema::seeds::quantity.eq(Quantity::NotEnough),
                        &crate::schema::seeds::owner_id.eq(user_id),
                        &crate::schema::seeds::plant_id.eq(-1),
                        &crate::schema::seeds::use_by.eq(NaiveDate::from_ymd_opt(2022, 01, 01)),
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
        .uri("/api/seeds")
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

    let page: Page<SeedDto> = serde_json::from_str(result_string).unwrap();
    assert_eq!(page.results.len(), 2);

    // Seeds should be ordered by use_by date in ascending order.
    let seed_dto1 = page.results.get(0).unwrap();
    assert_eq!(seed_dto1.id, -2);
    assert_eq!(seed_dto1.name, "Testia testium".to_owned());
    assert_eq!(seed_dto1.harvest_year, 2022);
    assert_eq!(seed_dto1.quantity, Quantity::NotEnough);
    assert_eq!(seed_dto1.use_by, NaiveDate::from_ymd_opt(2022, 01, 01));
    let seed_dto2 = page.results.get(1).unwrap();
    assert_eq!(seed_dto2.id, -1);
    assert_eq!(seed_dto2.name, "Testia testia".to_owned());
    assert_eq!(seed_dto2.harvest_year, 2022);
    assert_eq!(seed_dto2.quantity, Quantity::Enough);
    assert_eq!(seed_dto2.use_by, NaiveDate::from_ymd_opt(2023, 01, 01));
}

#[actix_rt::test]
async fn test_search_seeds_succeeds() {
    let user_id = uuid!("00000000-0000-0000-0000-000000000000");
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

            diesel::insert_into(crate::schema::seeds::table)
                .values(vec![
                    (
                        &crate::schema::seeds::id.eq(-1),
                        &crate::schema::seeds::name.eq("This one should be found!"),
                        &crate::schema::seeds::harvest_year.eq(2022),
                        &crate::schema::seeds::quantity.eq(Quantity::Enough),
                        &crate::schema::seeds::plant_id.eq(-1),
                        &crate::schema::seeds::owner_id.eq(user_id),
                    ),
                    (
                        &crate::schema::seeds::id.eq(-2),
                        &crate::schema::seeds::name.eq("Stays hidden"),
                        &crate::schema::seeds::harvest_year.eq(2023),
                        &crate::schema::seeds::quantity.eq(Quantity::NotEnough),
                        &crate::schema::seeds::plant_id.eq(-1),
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
        .uri("/api/seeds?name=found&per_page=10")
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

    let page: Page<SeedDto> = serde_json::from_str(result_string).unwrap();
    assert_eq!(page.results.len(), 1);

    let seed_dto = page.results.get(0).unwrap();
    assert_eq!(seed_dto.id, -1);
    assert_eq!(seed_dto.name, "This one should be found!".to_owned());
    assert_eq!(seed_dto.harvest_year, 2022);
    assert_eq!(seed_dto.quantity, Quantity::Enough);
}

#[actix_rt::test]
async fn test_find_by_id_succeeds() {
    let user_id = uuid!("00000000-0000-0000-0000-000000000000");
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

            diesel::insert_into(crate::schema::seeds::table)
                .values(vec![
                    (
                        &crate::schema::seeds::id.eq(-1),
                        &crate::schema::seeds::name.eq("Testia testia"),
                        &crate::schema::seeds::harvest_year.eq(2022),
                        &crate::schema::seeds::quantity.eq(Quantity::Enough),
                        &crate::schema::seeds::plant_id.eq(-1),
                        &crate::schema::seeds::owner_id.eq(user_id),
                    ),
                    (
                        &crate::schema::seeds::id.eq(-2),
                        &crate::schema::seeds::name.eq("Testia testium"),
                        &crate::schema::seeds::harvest_year.eq(2023),
                        &crate::schema::seeds::quantity.eq(Quantity::NotEnough),
                        &crate::schema::seeds::plant_id.eq(-1),
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
        .uri("/api/seeds/-1")
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

    let seed_dto: SeedDto = serde_json::from_str(result_string).unwrap();
    assert_eq!(seed_dto.id, -1);
    assert_eq!(seed_dto.name, "Testia testia".to_owned());
    assert_eq!(seed_dto.harvest_year, 2022);
    assert_eq!(seed_dto.quantity, Quantity::Enough);
}

#[actix_rt::test]
async fn test_find_by_non_existing_id_fails() {
    let user_id = uuid!("00000000-0000-0000-0000-000000000000");
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

            diesel::insert_into(crate::schema::seeds::table)
                .values(vec![
                    (
                        &crate::schema::seeds::id.eq(-1),
                        &crate::schema::seeds::name.eq("Testia testia"),
                        &crate::schema::seeds::harvest_year.eq(2022),
                        &crate::schema::seeds::quantity.eq(Quantity::Enough),
                        &crate::schema::seeds::plant_id.eq(-1),
                        &crate::schema::seeds::owner_id.eq(user_id),
                    ),
                    (
                        &crate::schema::seeds::id.eq(-2),
                        &crate::schema::seeds::name.eq("Testia testium"),
                        &crate::schema::seeds::harvest_year.eq(2023),
                        &crate::schema::seeds::quantity.eq(Quantity::NotEnough),
                        &crate::schema::seeds::plant_id.eq(-1),
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
        .uri("/api/seeds/-3")
        .insert_header((header::AUTHORIZATION, token))
        .send_request(&app)
        .await;

    assert_eq!(resp.status(), StatusCode::NOT_FOUND);
}

#[actix_rt::test]
async fn test_create_seed_fails_with_invalid_quantity() {
    let pool = init_test_database(|_| async { Ok(()) }.scope_boxed()).await;
    let (token, app) = init_test_app(pool.clone()).await;

    let resp = test::TestRequest::post()
        .uri("/api/seeds")
        .insert_header((header::AUTHORIZATION, token))
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
    let (token, app) = init_test_app(pool.clone()).await;

    let resp = test::TestRequest::post()
        .uri("/api/seeds")
        .insert_header((header::AUTHORIZATION, token))
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
    let (token, app) = init_test_app(pool.clone()).await;

    let resp = test::TestRequest::post()
        .uri("/api/seeds")
        .insert_header((header::AUTHORIZATION, token))
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
    let (token, app) = init_test_app(pool.clone()).await;

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
        .append_header((header::AUTHORIZATION, token.clone()))
        .set_json(new_seed)
        .send_request(&app)
        .await;
    assert_eq!(resp.status(), StatusCode::CREATED);

    let seed: SeedDto = test::read_body_json(resp).await;
    let resp = test::TestRequest::delete()
        .uri(&format!("/api/seeds/{}", seed.id))
        .insert_header((header::AUTHORIZATION, token))
        .send_request(&app)
        .await;

    assert_eq!(resp.status(), StatusCode::OK);
}

#[actix_rt::test]
async fn test_delete_by_id_succeeds() {
    let user_id = uuid!("00000000-0000-0000-0000-000000000000");
    let pool = init_test_database(|conn| {
        async {
            diesel::insert_into(crate::schema::seeds::table)
                .values((
                    &crate::schema::seeds::id.eq(-1),
                    &crate::schema::seeds::name.eq("Testia testia"),
                    &crate::schema::seeds::harvest_year.eq(2022),
                    &crate::schema::seeds::quantity.eq(Quantity::Enough),
                    &crate::schema::seeds::owner_id.eq(user_id),
                ))
                .execute(conn)
                .await?;
            Ok(())
        }
        .scope_boxed()
    })
    .await;
    let (token, app) = init_test_app_for_user(pool, user_id).await;

    let resp = test::TestRequest::delete()
        .uri("/api/seeds/-1")
        .insert_header((header::AUTHORIZATION, token))
        .send_request(&app)
        .await;

    assert_eq!(resp.status(), StatusCode::OK);
}

#[actix_rt::test]
async fn test_delete_by_non_existing_id_succeeds() {
    let user_id = uuid!("00000000-0000-0000-0000-000000000000");
    let pool = init_test_database(|conn| {
        async {
            diesel::insert_into(crate::schema::seeds::table)
                .values((
                    &crate::schema::seeds::id.eq(-1),
                    &crate::schema::seeds::name.eq("Testia testia"),
                    &crate::schema::seeds::harvest_year.eq(2022),
                    &crate::schema::seeds::quantity.eq(Quantity::Enough),
                    &crate::schema::seeds::owner_id.eq(user_id),
                ))
                .execute(conn)
                .await?;
            Ok(())
        }
        .scope_boxed()
    })
    .await;
    let (token, app) = init_test_app_for_user(pool, user_id).await;

    let resp = test::TestRequest::delete()
        .uri("/api/seeds/-2")
        .insert_header((header::AUTHORIZATION, token))
        .send_request(&app)
        .await;

    assert_eq!(resp.status(), StatusCode::OK);
}

#[actix_rt::test]
async fn test_archive_seed_succeeds() {
    let user_id = uuid!("00000000-0000-0000-0000-000000000000");
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

            diesel::insert_into(crate::schema::seeds::table)
                .values(vec![
                    (
                        &crate::schema::seeds::id.eq(-1),
                        &crate::schema::seeds::name.eq("Testia testia"),
                        &crate::schema::seeds::harvest_year.eq(2022),
                        &crate::schema::seeds::quantity.eq(Quantity::Enough),
                        &crate::schema::seeds::plant_id.eq(-1),
                        &crate::schema::seeds::owner_id.eq(user_id),
                        &crate::schema::seeds::use_by.eq(NaiveDate::from_ymd_opt(2023, 01, 01)),
                    ),
                    (
                        &crate::schema::seeds::id.eq(-2),
                        &crate::schema::seeds::name.eq("Testia testium"),
                        &crate::schema::seeds::harvest_year.eq(2022),
                        &crate::schema::seeds::quantity.eq(Quantity::NotEnough),
                        &crate::schema::seeds::plant_id.eq(-1),
                        &crate::schema::seeds::owner_id.eq(user_id),
                        &crate::schema::seeds::use_by.eq(NaiveDate::from_ymd_opt(2022, 01, 01)),
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

    // Archive seed number 1
    let archive_seed = ArchiveSeedDto { archived: true };
    let _ = test::TestRequest::patch()
        .uri("/api/seeds/-1/archive")
        .set_json(archive_seed)
        .insert_header((header::AUTHORIZATION, token.clone()))
        .send_request(&app)
        .await;

    let resp = test::TestRequest::get()
        .uri("/api/seeds?archived=both")
        .insert_header((header::AUTHORIZATION, token.clone()))
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

    // Seeds should be ordered by use_by date in ascending order.
    let seed_dto1 = page.results.get(0).unwrap();
    assert_eq!(seed_dto1.id, -2);
    assert_eq!(seed_dto1.name, "Testia testium".to_owned());
    assert_eq!(seed_dto1.harvest_year, 2022);
    assert_eq!(seed_dto1.quantity, Quantity::NotEnough);
    assert_eq!(seed_dto1.use_by, NaiveDate::from_ymd_opt(2022, 01, 01));
    let seed_dto2 = page.results.get(1).unwrap();
    assert_eq!(seed_dto2.id, -1);
    assert_eq!(seed_dto2.name, "Testia testia".to_owned());
    assert_eq!(seed_dto2.harvest_year, 2022);
    assert_ne!(seed_dto2.archived_at, None);
    assert_eq!(seed_dto2.quantity, Quantity::Enough);
    assert_eq!(seed_dto2.use_by, NaiveDate::from_ymd_opt(2023, 01, 01));
}
