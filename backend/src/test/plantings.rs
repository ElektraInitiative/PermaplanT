//! Tests for [`crate::controller::plantings`].

use std::ops::Add;

use actix_http::StatusCode;
use actix_web::{http::header, test};
use chrono::{Days, NaiveDate};
use diesel_async::{scoped_futures::ScopedFutureExt, RunQueryDsl};
use uuid::Uuid;

use crate::{
    model::{
        dto::{
            plantings::{
                DeletePlantingDto, MovePlantingDto, NewPlantingDto, PlantingDto, UpdatePlantingDto,
            },
            TimelinePage,
        },
        r#enum::layer_type::LayerType,
    },
    service::plantings::TIME_LINE_LOADING_OFFSET_DAYS,
    test::util::data,
};

use crate::test::util::{init_test_app, init_test_database};

#[actix_rt::test]
async fn test_can_search_plantings() {
    let pool = init_test_database(|conn| {
        async {
            diesel::insert_into(crate::schema::maps::table)
                .values(data::TestInsertableMap::default())
                .execute(conn)
                .await?;
            diesel::insert_into(crate::schema::layers::table)
                .values(vec![
                    data::TestInsertableLayer::default(),
                    data::TestInsertableLayer {
                        id: -2,
                        name: "Test Layer 2".to_owned(),
                        is_alternative: true,
                        ..Default::default()
                    },
                ])
                .execute(conn)
                .await?;
            diesel::insert_into(crate::schema::plants::table)
                .values(data::TestInsertablePlant::default())
                .execute(conn)
                .await?;
            diesel::insert_into(crate::schema::plantings::table)
                .values(vec![
                    data::TestInsertablePlanting {
                        id: Uuid::new_v4(),
                        layer_id: -1,
                        plant_id: -1,
                        ..Default::default()
                    },
                    data::TestInsertablePlanting {
                        id: Uuid::new_v4(),
                        layer_id: -2,
                        plant_id: -1,
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
        .uri("/api/maps/-1/layers/plants/plantings?layer_id=-1&relative_to_date=2023-05-08")
        .insert_header((header::AUTHORIZATION, token.clone()))
        .send_request(&app)
        .await;
    assert_eq!(resp.status(), StatusCode::OK);

    let page: TimelinePage<PlantingDto> = test::read_body_json(resp).await;
    assert_eq!(page.results.len(), 1);

    let resp = test::TestRequest::get()
        .uri("/api/maps/-1/layers/plants/plantings?relative_to_date=2023-05-08")
        .insert_header((header::AUTHORIZATION, token))
        .send_request(&app)
        .await;
    assert_eq!(resp.status(), StatusCode::OK);

    let page: TimelinePage<PlantingDto> = test::read_body_json(resp).await;
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
                .values(data::TestInsertableLayer {
                    type_: LayerType::Base,
                    ..Default::default()
                })
                .execute(conn)
                .await?;
            diesel::insert_into(crate::schema::plants::table)
                .values(data::TestInsertablePlant::default())
                .execute(conn)
                .await?;
            Ok(())
        }
        .scope_boxed()
    })
    .await;
    let (token, app) = init_test_app(pool.clone()).await;

    let new_planting = NewPlantingDto {
        id: Some(Uuid::new_v4()),
        action_id: Uuid::new_v4(),
        layer_id: -1,
        plant_id: -1,
        x: 0,
        y: 0,
        width: 0,
        height: 0,
        rotation: 0.0,
        scale_x: 0.0,
        scale_y: 0.0,
        add_date: None,
        seed_id: None,
    };

    let resp = test::TestRequest::post()
        .uri("/api/maps/-1/layers/plants/plantings")
        .insert_header((header::AUTHORIZATION, token))
        .set_json(new_planting)
        .send_request(&app)
        .await;
    assert_eq!(resp.status(), StatusCode::INTERNAL_SERVER_ERROR);
}

#[actix_rt::test]
async fn test_can_create_plantings() {
    let pool = init_test_database(|conn| {
        async {
            diesel::insert_into(crate::schema::maps::table)
                .values(data::TestInsertableMap::default())
                .execute(conn)
                .await?;
            diesel::insert_into(crate::schema::layers::table)
                .values(data::TestInsertableLayer::default())
                .execute(conn)
                .await?;
            diesel::insert_into(crate::schema::plants::table)
                .values(data::TestInsertablePlant::default())
                .execute(conn)
                .await?;
            Ok(())
        }
        .scope_boxed()
    })
    .await;
    let (token, app) = init_test_app(pool.clone()).await;

    let new_planting = NewPlantingDto {
        id: Some(Uuid::new_v4()),
        action_id: Uuid::new_v4(),
        layer_id: -1,
        plant_id: -1,
        x: 0,
        y: 0,
        width: 0,
        height: 0,
        rotation: 0.0,
        scale_x: 0.0,
        scale_y: 0.0,
        add_date: None,
        seed_id: None,
    };

    let resp = test::TestRequest::post()
        .uri("/api/maps/-1/layers/plants/plantings")
        .insert_header((header::AUTHORIZATION, token))
        .set_json(new_planting)
        .send_request(&app)
        .await;
    assert_eq!(resp.status(), StatusCode::CREATED);
}

#[actix_rt::test]
async fn test_can_update_plantings() {
    let planting_id = Uuid::new_v4();
    let pool = init_test_database(|conn| {
        async {
            diesel::insert_into(crate::schema::maps::table)
                .values(data::TestInsertableMap::default())
                .execute(conn)
                .await?;
            diesel::insert_into(crate::schema::layers::table)
                .values(data::TestInsertableLayer::default())
                .execute(conn)
                .await?;
            diesel::insert_into(crate::schema::plants::table)
                .values(data::TestInsertablePlant::default())
                .execute(conn)
                .await?;
            diesel::insert_into(crate::schema::plantings::table)
                .values(data::TestInsertablePlanting {
                    id: planting_id,
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

    let update_data = MovePlantingDto {
        x: 1,
        y: 1,
        action_id: Uuid::new_v4(),
    };
    let update_object = UpdatePlantingDto::Move(update_data);

    let resp = test::TestRequest::patch()
        .uri(&format!(
            "/api/maps/-1/layers/plants/plantings/{planting_id}"
        ))
        .insert_header((header::AUTHORIZATION, token))
        .set_json(update_object)
        .send_request(&app)
        .await;
    assert_eq!(resp.status(), StatusCode::OK);

    let planting: PlantingDto = test::read_body_json(resp).await;
    assert_eq!(planting.x, 1);
    assert_eq!(planting.y, 1);
}

#[actix_rt::test]
async fn test_can_delete_planting() {
    let planting_id = Uuid::new_v4();
    let pool = init_test_database(|conn| {
        async {
            diesel::insert_into(crate::schema::maps::table)
                .values(data::TestInsertableMap::default())
                .execute(conn)
                .await?;
            diesel::insert_into(crate::schema::layers::table)
                .values(data::TestInsertableLayer::default())
                .execute(conn)
                .await?;
            diesel::insert_into(crate::schema::plants::table)
                .values(data::TestInsertablePlant::default())
                .execute(conn)
                .await?;
            diesel::insert_into(crate::schema::plantings::table)
                .values(data::TestInsertablePlanting {
                    id: planting_id,
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
        .uri(&format!(
            "/api/maps/-1/layers/plants/plantings/{planting_id}",
        ))
        .insert_header((header::AUTHORIZATION, token.clone()))
        .set_json(DeletePlantingDto {
            action_id: Uuid::new_v4(),
        })
        .send_request(&app)
        .await;
    assert_eq!(resp.status(), StatusCode::OK);

    let resp = test::TestRequest::get()
        .uri("/api/maps/-1/layers/plants/plantings?relative_to_date=2023-05-08")
        .insert_header((header::AUTHORIZATION, token))
        .send_request(&app)
        .await;
    assert_eq!(resp.status(), StatusCode::OK);

    let page: TimelinePage<PlantingDto> = test::read_body_json(resp).await;
    assert_eq!(page.results.len(), 0);
}

#[actix_rt::test]
async fn test_removed_planting_outside_loading_offset_is_not_in_timeline() {
    let planting_id = Uuid::new_v4();
    let remove_date = NaiveDate::from_ymd_opt(2022, 1, 1).expect("date is valid");

    let pool = init_test_database(|conn| {
        async {
            diesel::insert_into(crate::schema::maps::table)
                .values(data::TestInsertableMap::default())
                .execute(conn)
                .await?;
            diesel::insert_into(crate::schema::layers::table)
                .values(data::TestInsertableLayer::default())
                .execute(conn)
                .await?;
            diesel::insert_into(crate::schema::plants::table)
                .values(data::TestInsertablePlant::default())
                .execute(conn)
                .await?;
            diesel::insert_into(crate::schema::plantings::table)
                .values(data::TestInsertablePlanting {
                    id: planting_id,
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
            "/api/maps/-1/layers/plants/plantings?relative_to_date={}",
            remove_date
                .add(Days::new(TIME_LINE_LOADING_OFFSET_DAYS))
                .format("%Y-%m-%d"),
        ))
        .insert_header((header::AUTHORIZATION, token))
        .send_request(&app)
        .await;
    assert_eq!(resp.status(), StatusCode::OK);

    let page: TimelinePage<PlantingDto> = test::read_body_json(resp).await;
    assert_eq!(page.results.len(), 0);
}

#[actix_rt::test]
async fn test_removed_planting_inside_loading_offset_is_in_timeline() {
    let planting_id = Uuid::new_v4();
    let remove_date = NaiveDate::from_ymd_opt(2022, 1, 1).expect("date is valid");

    let pool = init_test_database(|conn| {
        async {
            diesel::insert_into(crate::schema::maps::table)
                .values(data::TestInsertableMap::default())
                .execute(conn)
                .await?;
            diesel::insert_into(crate::schema::layers::table)
                .values(data::TestInsertableLayer::default())
                .execute(conn)
                .await?;
            diesel::insert_into(crate::schema::plants::table)
                .values(data::TestInsertablePlant::default())
                .execute(conn)
                .await?;
            diesel::insert_into(crate::schema::plantings::table)
                .values(data::TestInsertablePlanting {
                    id: planting_id,
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
            "/api/maps/-1/layers/plants/plantings?relative_to_date={}",
            remove_date.add(Days::new(1)).format("%Y-%m-%d"),
        ))
        .insert_header((header::AUTHORIZATION, token))
        .send_request(&app)
        .await;
    assert_eq!(resp.status(), StatusCode::OK);

    let page: TimelinePage<PlantingDto> = test::read_body_json(resp).await;
    assert_eq!(page.results.len(), 1);
}

#[actix_rt::test]
async fn test_added_planting_outside_loading_offset_is_not_in_timeline() {
    let planting_id = Uuid::new_v4();
    let current_date = NaiveDate::from_ymd_opt(2022, 1, 1).expect("date is valid");
    let add_date = current_date.add(Days::new(TIME_LINE_LOADING_OFFSET_DAYS));

    let pool = init_test_database(|conn| {
        async {
            diesel::insert_into(crate::schema::maps::table)
                .values(data::TestInsertableMap::default())
                .execute(conn)
                .await?;
            diesel::insert_into(crate::schema::layers::table)
                .values(data::TestInsertableLayer::default())
                .execute(conn)
                .await?;
            diesel::insert_into(crate::schema::plants::table)
                .values(data::TestInsertablePlant::default())
                .execute(conn)
                .await?;
            diesel::insert_into(crate::schema::plantings::table)
                .values(data::TestInsertablePlanting {
                    id: planting_id,
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
            "/api/maps/-1/layers/plants/plantings?relative_to_date={}",
            current_date.format("%Y-%m-%d"),
        ))
        .insert_header((header::AUTHORIZATION, token))
        .send_request(&app)
        .await;
    assert_eq!(resp.status(), StatusCode::OK);

    let page: TimelinePage<PlantingDto> = test::read_body_json(resp).await;
    assert_eq!(page.results.len(), 0);
}
