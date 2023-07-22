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
            shadings::{
                DeleteShadingDto, NewShadingDto, ShadingDto, UpdateShadingDto,
                UpdateValuesShadingDto,
            },
            TimelinePage,
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
        .uri("/api/maps/-1/layers/shade/shadings?layer_id=-1&relative_to_date=2023-05-08")
        .insert_header((header::AUTHORIZATION, token.clone()))
        .send_request(&app)
        .await;
    assert_eq!(resp.status(), StatusCode::OK);

    let page: TimelinePage<ShadingDto> = test::read_body_json(resp).await;
    assert_eq!(page.results.len(), 1);

    let resp = test::TestRequest::get()
        .uri("/api/maps/-1/layers/shade/shadings?relative_to_date=2023-05-08")
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
        action_id: Uuid::new_v4(),
        shade_type: Shade::LightShade,
        geometry: small_rectangle(),
        layer_id: -1,
        add_date: None,
    };

    let resp = test::TestRequest::post()
        .uri("/api/maps/-1/layers/shade/shadings")
        .insert_header((header::AUTHORIZATION, token))
        .set_json(new_shading)
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
        action_id: Uuid::new_v4(),
        layer_id: -1,
        shade_type: Shade::LightShade,
        geometry: small_rectangle(),
        add_date: None,
    };

    let resp = test::TestRequest::post()
        .uri("/api/maps/-1/layers/shade/shadings")
        .insert_header((header::AUTHORIZATION, token))
        .set_json(new_shading)
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
        shade_type: Some(Shade::PermanentDeepShade),
        geometry: None,
        action_id: Uuid::new_v4(),
    };
    let update_object = UpdateShadingDto::Update(update_data);

    let resp = test::TestRequest::patch()
        .uri(&format!("/api/maps/-1/layers/shade/shadings/{shading_id}"))
        .insert_header((header::AUTHORIZATION, token))
        .set_json(update_object)
        .send_request(&app)
        .await;
    assert_eq!(resp.status(), StatusCode::OK);

    let shading: ShadingDto = test::read_body_json(resp).await;
    assert_eq!(shading.shade_type, Shade::PermanentDeepShade);
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

    let resp = test::TestRequest::delete()
        .uri(&format!("/api/maps/-1/layers/shade/shadings/{shading_id}",))
        .insert_header((header::AUTHORIZATION, token.clone()))
        .set_json(DeleteShadingDto {
            action_id: Uuid::new_v4(),
        })
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
