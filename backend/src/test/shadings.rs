//! Tests for [`crate::controller::shadings`].

use std::ops::Add;

use actix_http::StatusCode;
use actix_web::{http::header, test};
use chrono::{Days, NaiveDate};
use diesel_async::{scoped_futures::ScopedFutureExt, RunQueryDsl};
use uuid::Uuid;

use crate::{
    model::{
        dto::{
            core::TimelinePage,
            shadings::{
                DeleteShadingDto, NewShadingDto, ShadingDto, UpdateShadingDto,
                UpdateValuesShadingDto,
            },
        },
        r#enum::{layer_type::LayerType, shade::Shade},
    },
    service::shadings::TIME_LINE_LOADING_OFFSET_DAYS,
    test::util::{data, dummy_map_polygons::small_rectangle},
};

use crate::test::util::{init_test_app, init_test_database};

#[actix_rt::test]
async fn test_can_search_shadings() {
    let pool = init_test_database(|conn| {
        async {
            diesel::insert_into(crate::schema::maps::table)
                .values(data::TestInsertableMap::default())
                .execute(conn)
                .await?;
            diesel::insert_into(crate::schema::layers::table)
                .values(vec![
                    data::TestInsertableShadeLayer::default(),
                    data::TestInsertableShadeLayer {
                        id: -2,
                        name: "Test Layer 2".to_owned(),
                        is_alternative: true,
                        ..Default::default()
                    },
                ])
                .execute(conn)
                .await?;
            diesel::insert_into(crate::schema::shadings::table)
                .values(vec![
                    data::TestInsertableShading {
                        id: Uuid::new_v4(),
                        layer_id: -1,
                        ..Default::default()
                    },
                    data::TestInsertableShading {
                        id: Uuid::new_v4(),
                        layer_id: -2,
                        ..Default::default()
                    },
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
        .uri("/api/maps/-1/layers/shade/shadings")
        .insert_header((header::AUTHORIZATION, token.clone()))
        .send_request(&app)
        .await;
    assert_eq!(resp.status(), StatusCode::OK);

    let page: TimelinePage<ShadingDto> = test::read_body_json(resp).await;
    assert_eq!(page.results.len(), 1);

    let resp = test::TestRequest::get()
        .uri("/api/maps/-1/layers/shade/shadings")
        .insert_header((header::AUTHORIZATION, token))
        .send_request(&app)
        .await;
    assert_eq!(resp.status(), StatusCode::OK);

    let page: TimelinePage<ShadingDto> = test::read_body_json(resp).await;
    assert_eq!(page.results.len(), 2);
}

#[actix_rt::test]
async fn test_create_fails_with_invalid_layer() {
    let pool = init_test_database(|conn| {
        async {
            diesel::insert_into(crate::schema::maps::table)
                .values(data::TestInsertableMap::default())
                .execute(conn)
                .await?;
            diesel::insert_into(crate::schema::layers::table)
                .values(data::TestInsertableShadeLayer {
                    type_: LayerType::Base,
                    ..Default::default()
                })
                .execute(conn)
                .await?;
            Ok(())
        }
        .scope_boxed()
    })
    .await;
    let (token, app) = init_test_app(pool.clone()).await;

    let new_shading = NewShadingDto {
        id: Some(Uuid::new_v4()),
        shade: Shade::LightShade,
        geometry: small_rectangle(),
        layer_id: -1,
        add_date: None,
    };

    let mut shading_vec = Vec::new();
    shading_vec.push(new_shading);

    let resp = test::TestRequest::post()
        .uri("/api/maps/-1/layers/shade/shadings")
        .insert_header((header::AUTHORIZATION, token))
        .set_json(shading_vec)
        .send_request(&app)
        .await;
    assert_eq!(resp.status(), StatusCode::INTERNAL_SERVER_ERROR);
}

#[actix_rt::test]
async fn test_can_create_shadings() {
    let pool = init_test_database(|conn| {
        async {
            diesel::insert_into(crate::schema::maps::table)
                .values(data::TestInsertableMap::default())
                .execute(conn)
                .await?;
            diesel::insert_into(crate::schema::layers::table)
                .values(data::TestInsertableShadeLayer::default())
                .execute(conn)
                .await?;
            Ok(())
        }
        .scope_boxed()
    })
    .await;
    let (token, app) = init_test_app(pool.clone()).await;

    let new_shading = NewShadingDto {
        id: Some(Uuid::new_v4()),
        layer_id: -1,
        shade: Shade::LightShade,
        geometry: small_rectangle(),
        add_date: None,
    };

    let mut shading_vec = Vec::new();
    shading_vec.push(new_shading);

    let resp = test::TestRequest::post()
        .uri("/api/maps/-1/layers/shade/shadings")
        .insert_header((header::AUTHORIZATION, token))
        .set_json(shading_vec)
        .send_request(&app)
        .await;
    assert_eq!(resp.status(), StatusCode::CREATED);
}

#[actix_rt::test]
async fn test_can_update_shadings() {
    let shading_id = Uuid::new_v4();
    let pool = init_test_database(|conn| {
        async {
            diesel::insert_into(crate::schema::maps::table)
                .values(data::TestInsertableMap::default())
                .execute(conn)
                .await?;
            diesel::insert_into(crate::schema::layers::table)
                .values(data::TestInsertableShadeLayer::default())
                .execute(conn)
                .await?;
            diesel::insert_into(crate::schema::shadings::table)
                .values(data::TestInsertableShading {
                    id: shading_id,
                    ..Default::default()
                })
                .execute(conn)
                .await?;
            Ok(())
        }
        .scope_boxed()
    })
    .await;
    let (token, app) = init_test_app(pool.clone()).await;

    let update_data = UpdateValuesShadingDto {
        id: shading_id,
        shade: Some(Shade::PermanentDeepShade),
        geometry: None,
    };
    let mut update_vec = Vec::new();
    update_vec.push(update_data);

    let update_object = UpdateShadingDto::Update(update_vec);

    let resp = test::TestRequest::patch()
        .uri(&format!("/api/maps/-1/layers/shade/shadings/"))
        .insert_header((header::AUTHORIZATION, token))
        .set_json(update_object)
        .send_request(&app)
        .await;
    assert_eq!(resp.status(), StatusCode::OK);

    let shading: Vec<ShadingDto> = test::read_body_json(resp).await;
    assert_eq!(shading[0].shade, Shade::PermanentDeepShade);
}

#[actix_rt::test]
async fn test_can_delete_shading() {
    let shading_id = Uuid::new_v4();
    let pool = init_test_database(|conn| {
        async {
            diesel::insert_into(crate::schema::maps::table)
                .values(data::TestInsertableMap::default())
                .execute(conn)
                .await?;
            diesel::insert_into(crate::schema::layers::table)
                .values(data::TestInsertableShadeLayer::default())
                .execute(conn)
                .await?;
            diesel::insert_into(crate::schema::shadings::table)
                .values(data::TestInsertableShading {
                    id: shading_id,
                    ..Default::default()
                })
                .execute(conn)
                .await?;
            Ok(())
        }
        .scope_boxed()
    })
    .await;
    let (token, app) = init_test_app(pool.clone()).await;

    let mut delete_vec = Vec::new();
    delete_vec.push(DeleteShadingDto { id: shading_id });

    let resp = test::TestRequest::delete()
        .uri(&format!("/api/maps/-1/layers/shade/shadings/",))
        .insert_header((header::AUTHORIZATION, token.clone()))
        .set_json(delete_vec)
        .send_request(&app)
        .await;
    assert_eq!(resp.status(), StatusCode::OK);

    let resp = test::TestRequest::get()
        .uri("/api/maps/-1/layers/shade/shadings?relative_to_date=2023-05-08")
        .insert_header((header::AUTHORIZATION, token))
        .send_request(&app)
        .await;
    assert_eq!(resp.status(), StatusCode::OK);

    let page: TimelinePage<ShadingDto> = test::read_body_json(resp).await;
    assert_eq!(page.results.len(), 0);
}

#[actix_rt::test]
async fn test_removed_shading_outside_loading_offset_is_not_in_timeline() {
    let shading_id = Uuid::new_v4();
    let remove_date = NaiveDate::from_ymd_opt(2022, 1, 1).expect("date is valid");

    let pool = init_test_database(|conn| {
        async {
            diesel::insert_into(crate::schema::maps::table)
                .values(data::TestInsertableMap::default())
                .execute(conn)
                .await?;
            diesel::insert_into(crate::schema::layers::table)
                .values(data::TestInsertableShadeLayer::default())
                .execute(conn)
                .await?;
            diesel::insert_into(crate::schema::shadings::table)
                .values(data::TestInsertableShading {
                    id: shading_id,
                    remove_date: Some(remove_date),
                    ..Default::default()
                })
                .execute(conn)
                .await?;
            Ok(())
        }
        .scope_boxed()
    })
    .await;
    let (token, app) = init_test_app(pool.clone()).await;

    let resp = test::TestRequest::get()
        .uri(&format!(
            "/api/maps/-1/layers/shade/shadings?relative_to_date={}",
            remove_date
                .add(Days::new(TIME_LINE_LOADING_OFFSET_DAYS))
                .format("%Y-%m-%d"),
        ))
        .insert_header((header::AUTHORIZATION, token))
        .send_request(&app)
        .await;
    assert_eq!(resp.status(), StatusCode::OK);

    let page: TimelinePage<ShadingDto> = test::read_body_json(resp).await;
    assert_eq!(page.results.len(), 0);
}

#[actix_rt::test]
async fn test_removed_shading_inside_loading_offset_is_in_timeline() {
    let shading_id = Uuid::new_v4();
    let remove_date = NaiveDate::from_ymd_opt(2022, 1, 1).expect("date is valid");

    let pool = init_test_database(|conn| {
        async {
            diesel::insert_into(crate::schema::maps::table)
                .values(data::TestInsertableMap::default())
                .execute(conn)
                .await?;
            diesel::insert_into(crate::schema::layers::table)
                .values(data::TestInsertableShadeLayer::default())
                .execute(conn)
                .await?;
            diesel::insert_into(crate::schema::shadings::table)
                .values(data::TestInsertableShading {
                    id: shading_id,
                    remove_date: Some(remove_date),
                    ..Default::default()
                })
                .execute(conn)
                .await?;
            Ok(())
        }
        .scope_boxed()
    })
    .await;
    let (token, app) = init_test_app(pool.clone()).await;

    let resp = test::TestRequest::get()
        .uri(&format!(
            "/api/maps/-1/layers/shade/shadings?relative_to_date={}",
            remove_date.add(Days::new(1)).format("%Y-%m-%d"),
        ))
        .insert_header((header::AUTHORIZATION, token))
        .send_request(&app)
        .await;
    assert_eq!(resp.status(), StatusCode::OK);

    let page: TimelinePage<ShadingDto> = test::read_body_json(resp).await;
    assert_eq!(page.results.len(), 1);
}

#[actix_rt::test]
async fn test_added_shading_outside_loading_offset_is_not_in_timeline() {
    let shading_id = Uuid::new_v4();
    let current_date = NaiveDate::from_ymd_opt(2022, 1, 1).expect("date is valid");
    let add_date = current_date.add(Days::new(TIME_LINE_LOADING_OFFSET_DAYS));

    let pool = init_test_database(|conn| {
        async {
            diesel::insert_into(crate::schema::maps::table)
                .values(data::TestInsertableMap::default())
                .execute(conn)
                .await?;
            diesel::insert_into(crate::schema::layers::table)
                .values(data::TestInsertableShadeLayer::default())
                .execute(conn)
                .await?;
            diesel::insert_into(crate::schema::shadings::table)
                .values(data::TestInsertableShading {
                    id: shading_id,
                    add_date: Some(add_date),
                    ..Default::default()
                })
                .execute(conn)
                .await?;
            Ok(())
        }
        .scope_boxed()
    })
    .await;
    let (token, app) = init_test_app(pool.clone()).await;

    let resp = test::TestRequest::get()
        .uri(&format!(
            "/api/maps/-1/layers/shade/shadings?relative_to_date={}",
            current_date.format("%Y-%m-%d"),
        ))
        .insert_header((header::AUTHORIZATION, token))
        .send_request(&app)
        .await;
    assert_eq!(resp.status(), StatusCode::OK);

    let page: TimelinePage<ShadingDto> = test::read_body_json(resp).await;
    assert_eq!(page.results.len(), 0);
}
