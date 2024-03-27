//! Tests for [`crate::controller::plant_layer`].

use actix_web::{
    http::{header, StatusCode},
    test,
};
use diesel::ExpressionMethods;
use diesel_async::{scoped_futures::ScopedFutureExt, RunQueryDsl};

use crate::{
    model::{dto::RelationsDto, r#enum::relation_type::RelationType},
    test::util::{init_test_app, init_test_database},
};

#[actix_web::test]
async fn test_plants_relations_include_the_other_plant_in_the_relation() {
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
                        &crate::schema::relations::plant1.eq(-1),
                        &crate::schema::relations::plant2.eq(-3),
                        &crate::schema::relations::relation.eq(RelationType::Companion),
                    ),
                    (
                        &crate::schema::relations::plant1.eq(-4),
                        &crate::schema::relations::plant2.eq(-2),
                        &crate::schema::relations::relation.eq(RelationType::Companion),
                    ),
                    (
                        &crate::schema::relations::plant1.eq(-3),
                        &crate::schema::relations::plant2.eq(-2),
                        &crate::schema::relations::relation.eq(RelationType::Neutral),
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
        .uri("/api/maps/-1/layers/plants/relations?plant_id=-3")
        .insert_header((header::AUTHORIZATION, token.clone()))
        .send_request(&app)
        .await;
    assert_eq!(resp.status(), StatusCode::OK);
    let result = test::read_body(resp).await;
    let result_string = std::str::from_utf8(&result).unwrap();
    let dto: RelationsDto = serde_json::from_str(result_string).unwrap();
    assert_eq!(dto.id, -3);
    assert_eq!(dto.relations.len(), 2);
    assert!(dto.relations.iter().any(|r| r.id == -1));
    assert!(dto.relations.iter().any(|r| r.id == -2));
}

#[actix_web::test]
async fn test_plants_relations_can_be_related_to_themselves() {
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
                        &crate::schema::relations::plant1.eq(-1),
                        &crate::schema::relations::plant2.eq(-3),
                        &crate::schema::relations::relation.eq(RelationType::Companion),
                    ),
                    (
                        &crate::schema::relations::plant1.eq(-3),
                        &crate::schema::relations::plant2.eq(-3),
                        &crate::schema::relations::relation.eq(RelationType::Neutral),
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
        .uri("/api/maps/-1/layers/plants/relations?plant_id=-3")
        .insert_header((header::AUTHORIZATION, token.clone()))
        .send_request(&app)
        .await;
    assert_eq!(resp.status(), StatusCode::OK);
    let result = test::read_body(resp).await;
    let result_string = std::str::from_utf8(&result).unwrap();
    let dto: RelationsDto = serde_json::from_str(result_string).unwrap();
    assert_eq!(dto.id, -3);
    assert_eq!(dto.relations.len(), 2);
    assert!(dto.relations.iter().any(|r| r.id == -1));
    assert!(dto.relations.iter().any(|r| r.id == -3));
}

#[actix_web::test]
async fn test_plants_relations_are_distinct() {
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
                        &crate::schema::relations::plant1.eq(-1),
                        &crate::schema::relations::plant2.eq(-3),
                        &crate::schema::relations::relation.eq(RelationType::Companion),
                    ),
                    (
                        &crate::schema::relations::plant1.eq(-3),
                        &crate::schema::relations::plant2.eq(-1),
                        &crate::schema::relations::relation.eq(RelationType::Companion),
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
        .uri("/api/maps/-1/layers/plants/relations?plant_id=-3")
        .insert_header((header::AUTHORIZATION, token.clone()))
        .send_request(&app)
        .await;
    assert_eq!(resp.status(), StatusCode::OK);
    let result = test::read_body(resp).await;
    let result_string = std::str::from_utf8(&result).unwrap();
    let dto: RelationsDto = serde_json::from_str(result_string).unwrap();
    assert_eq!(dto.id, -3);
    assert_eq!(dto.relations.len(), 1);
    assert!(dto.relations.iter().any(|r| r.id == -1));
}
