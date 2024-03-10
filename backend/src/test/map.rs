//! Tests for [`crate::controller::map`].

use std::time::Duration;

use crate::test::util::data::{self, TestInsertableMap};
use crate::test::util::dummy_map_polygons::small_rectangle;
use crate::{
    model::{
        dto::{MapDto, NewMapDto, Page, UpdateMapDto},
        r#enum::privacy_option::PrivacyOption,
    },
    test::util::{dummy_map_polygons::tall_rectangle, init_test_app, init_test_database},
};
use actix_http::Request;
use actix_service::Service;
use actix_web::body::MessageBody;
use actix_web::dev::ServiceResponse;
use actix_web::Error;
use actix_web::{
    http::{header, StatusCode},
    test,
};
use chrono::Utc;
use diesel_async::{scoped_futures::ScopedFutureExt, RunQueryDsl};
use lib_db::model::dto::core::{
    ActionDtoWrapper, ActionDtoWrapperDeletePlantings, ActionDtoWrapperNewPlantings,
    ActionDtoWrapperUpdatePlantings,
};
use lib_db::model::dto::plantings::{
    DeletePlantingDto, PlantingDto, TransformPlantingDto, UpdatePlantingDto,
};
use lib_db::model::dto::UpdateMapGeometryDto;
use tokio::time::sleep;
use uuid::Uuid;

#[actix_rt::test]
async fn test_can_search_maps() {
    let pool = init_test_database(|conn| {
        async {
            diesel::insert_into(crate::schema::maps::table)
                .values(vec![
                    TestInsertableMap {
                        name: "Test Map: can find map".to_owned(),
                        ..Default::default()
                    },
                    TestInsertableMap {
                        id: -2,
                        name: "Other".to_owned(),
                        created_by: Uuid::new_v4(),
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
        .uri("/api/maps")
        .insert_header((header::AUTHORIZATION, token.clone()))
        .send_request(&app)
        .await;

    assert_eq!(resp.status(), StatusCode::OK);

    let result = test::read_body(resp).await;
    let result_string = std::str::from_utf8(&result).unwrap();
    let page: Page<MapDto> = serde_json::from_str(result_string).unwrap();

    assert_eq!(page.results.len(), 2);

    let resp = test::TestRequest::get()
        .uri("/api/maps?name=Other")
        .insert_header((header::AUTHORIZATION, token))
        .send_request(&app)
        .await;

    assert_eq!(resp.status(), StatusCode::OK);

    let result = test::read_body(resp).await;
    let result_string = std::str::from_utf8(&result).unwrap();
    let page: Page<MapDto> = serde_json::from_str(result_string).unwrap();

    assert_eq!(page.results.len(), 1);
}

#[actix_rt::test]
async fn test_can_find_map_by_id() {
    let pool = init_test_database(|conn| {
        async {
            diesel::insert_into(crate::schema::maps::table)
                .values(TestInsertableMap {
                    id: -1,
                    name: "Test Map: can find map".to_owned(),
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
        .uri("/api/maps/-1")
        .insert_header((header::AUTHORIZATION, token))
        .send_request(&app)
        .await;

    assert_eq!(resp.status(), StatusCode::OK);
}

#[actix_rt::test]
async fn test_can_create_map() {
    let pool = init_test_database(|_| async { Ok(()) }.scope_boxed()).await;
    let (token, app) = init_test_app(pool.clone()).await;

    let new_map = NewMapDto {
        name: "Test Map: can create map".to_owned(),
        deletion_date: None,
        last_visit: None,
        is_inactive: false,
        zoom_factor: 100,
        honors: 0,
        visits: 0,
        harvested: 0,
        privacy: PrivacyOption::Public,
        description: None,
        location: None,
        geometry: tall_rectangle(),
    };

    let resp = test::TestRequest::post()
        .uri("/api/maps")
        .insert_header((header::AUTHORIZATION, token.clone()))
        .set_json(new_map)
        .send_request(&app)
        .await;

    assert_eq!(resp.status(), StatusCode::CREATED);

    let map: MapDto = test::read_body_json(resp).await;
    let resp = test::TestRequest::get()
        .uri(&format!("/api/maps/{}", map.id))
        .insert_header((header::AUTHORIZATION, token))
        .send_request(&app)
        .await;

    assert_eq!(resp.status(), StatusCode::OK);
}

#[actix_rt::test]
async fn test_update_fails_for_not_owner() {
    let pool = init_test_database(|conn| {
        async {
            diesel::insert_into(crate::schema::maps::table)
                .values(TestInsertableMap {
                    id: -1,
                    name: "Test Map: no update permission".to_owned(),
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

    let map_update = UpdateMapDto {
        name: Some("This will fail".to_owned()),
        privacy: None,
        description: None,
        location: None,
    };

    let resp = test::TestRequest::patch()
        .uri("/api/maps/-1")
        .insert_header((header::AUTHORIZATION, token))
        .set_json(map_update)
        .send_request(&app)
        .await;
    assert_eq!(resp.status(), StatusCode::FORBIDDEN);
}

#[actix_rt::test]
async fn test_can_update_map() {
    let pool = init_test_database(|_| async { Ok(()) }.scope_boxed()).await;
    let (token, app) = init_test_app(pool.clone()).await;

    let new_map = NewMapDto {
        name: "Test Map: can update map".to_owned(),
        deletion_date: None,
        last_visit: None,
        is_inactive: false,
        zoom_factor: 100,
        honors: 0,
        visits: 0,
        harvested: 0,
        privacy: PrivacyOption::Public,
        description: None,
        location: None,
        geometry: tall_rectangle(),
    };

    let resp = test::TestRequest::post()
        .uri("/api/maps")
        .insert_header((header::AUTHORIZATION, token.clone()))
        .set_json(new_map)
        .send_request(&app)
        .await;
    let map: MapDto = test::read_body_json(resp).await;

    let map_update = UpdateMapDto {
        name: Some("This will succeed".to_owned()),
        privacy: None,
        description: None,
        location: None,
    };

    let resp = test::TestRequest::patch()
        .uri(&format!("/api/maps/{}", map.id))
        .insert_header((header::AUTHORIZATION, token))
        .set_json(map_update)
        .send_request(&app)
        .await;

    let updated_map: MapDto = test::read_body_json(resp).await;
    assert_ne!(updated_map.name, map.name)
}

#[actix_rt::test]
async fn test_can_update_map_geometry() {
    let pool = init_test_database(|_| async { Ok(()) }.scope_boxed()).await;
    let (token, app) = init_test_app(pool.clone()).await;

    let new_map = NewMapDto {
        name: "Test Map: can update map geometry".to_owned(),
        deletion_date: None,
        last_visit: None,
        is_inactive: false,
        zoom_factor: 100,
        honors: 0,
        visits: 0,
        harvested: 0,
        privacy: PrivacyOption::Public,
        description: None,
        location: None,
        geometry: tall_rectangle(),
    };

    let resp = test::TestRequest::post()
        .uri("/api/maps")
        .insert_header((header::AUTHORIZATION, token.clone()))
        .set_json(new_map)
        .send_request(&app)
        .await;
    let map: MapDto = test::read_body_json(resp).await;

    let map_update_geometry = UpdateMapGeometryDto {
        geometry: small_rectangle(),
    };

    let resp = test::TestRequest::patch()
        .uri(&format!("/api/maps/{}/geometry", map.id))
        .insert_header((header::AUTHORIZATION, token))
        .set_json(map_update_geometry)
        .send_request(&app)
        .await;

    let updated_map: MapDto = test::read_body_json(resp).await;
    assert_ne!(updated_map.geometry, map.geometry);
}

async fn _get_map(
    map_id: i32,
    token: String,
    app: &impl Service<Request, Response = ServiceResponse<impl MessageBody>, Error = Error>,
) -> MapDto {
    let resp = test::TestRequest::get()
        .uri(&format!("/api/maps/{map_id}"))
        .insert_header((header::AUTHORIZATION, token))
        .send_request(app)
        .await;
    assert_eq!(resp.status(), StatusCode::OK);
    test::read_body_json(resp).await
}

#[actix_rt::test]
async fn test_update_plantings_map_sets_updated_at() {
    // This test asserts that when we add, update or remove plantings on a map,
    // the modified_at field on that map updates.
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

    let planting = PlantingDto {
        id: Uuid::new_v4(),
        layer_id: -1,
        plant_id: -1,
        x: 0,
        y: 0,
        rotation: 0.0,
        size_x: 3,
        size_y: 3,
        add_date: None,
        seed_id: None,
        is_area: false,
        created_at: Utc::now().naive_utc(),
        created_by: Uuid::new_v4(),
        modified_at: Utc::now().naive_utc(),
        modified_by: Uuid::new_v4(),
        remove_date: Some(Utc::now().date_naive()),
        additional_name: None,
        planting_notes: String::new(),
    };
    let planting_id = planting.id;

    // Updated modified_at after insert a planting
    let map_at_start: MapDto = _get_map(-1, token.clone(), &app).await;
    let new_planting_action: ActionDtoWrapperNewPlantings = ActionDtoWrapper {
        action_id: Uuid::new_v4(),
        dto: vec![planting],
    };
    sleep(Duration::from_secs(1)).await;
    let resp = test::TestRequest::post()
        .uri("/api/maps/-1/layers/plants/plantings")
        .insert_header((header::AUTHORIZATION, token.clone()))
        .set_json(new_planting_action)
        .send_request(&app)
        .await;

    assert_eq!(resp.status(), StatusCode::CREATED);
    let map_after_adding_planting: MapDto = _get_map(-1, token.clone(), &app).await;
    assert!(map_after_adding_planting.modified_at > map_at_start.modified_at);

    // Updated modified_at after modifying a planting
    let move_planting_action: ActionDtoWrapperUpdatePlantings = ActionDtoWrapper {
        action_id: Uuid::new_v4(),
        dto: UpdatePlantingDto::Transform(vec![TransformPlantingDto {
            id: planting_id,
            x: 20,
            y: 20,
            rotation: 0.3,
            size_x: 10,
            size_y: 10,
        }]),
    };
    sleep(Duration::from_secs(1)).await;
    let resp = test::TestRequest::patch()
        .uri("/api/maps/-1/layers/plants/plantings")
        .insert_header((header::AUTHORIZATION, token.clone()))
        .set_json(move_planting_action)
        .send_request(&app)
        .await;
    assert_eq!(resp.status(), StatusCode::OK);
    let map_after_update_planting = _get_map(-1, token.clone(), &app).await;
    assert!(map_after_update_planting.modified_at > map_after_adding_planting.modified_at);

    // Updated modified_at after deleting planting
    let delete_planting_action: ActionDtoWrapperDeletePlantings = ActionDtoWrapper {
        action_id: Uuid::new_v4(),
        dto: vec![DeletePlantingDto { id: planting_id }],
    };
    sleep(Duration::from_secs(1)).await;
    let resp = test::TestRequest::delete()
        .uri("/api/maps/-1/layers/plants/plantings")
        .insert_header((header::AUTHORIZATION, token.clone()))
        .set_json(delete_planting_action)
        .send_request(&app)
        .await;
    assert_eq!(resp.status(), StatusCode::OK);
    let map_after_deleting_planting: MapDto = _get_map(-1, token, &app).await;
    assert!(map_after_deleting_planting.modified_at > map_after_update_planting.modified_at);
}
