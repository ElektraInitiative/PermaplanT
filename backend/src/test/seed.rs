//! Tests for [`crate::controller::seed`].

#[cfg(test)]
mod tests {
    use crate::config::routes;
    use crate::model::dto::NewSeedDto;
    use crate::model::dto::SeedDto;
    use crate::model::r#enum::quantity::Quantity;
    use crate::test::test_utils::init_test_database;
    use actix_web::App;
    use actix_web::{http::StatusCode, test, web::Data};
    use diesel::prelude::*;
    use diesel_async::scoped_futures::ScopedFutureExt;
    use diesel_async::RunQueryDsl;

    #[actix_rt::test]
    async fn test_create_seed_fails_with_invalid_quantity() {
        let pool = init_test_database(|_| async { Ok(()) }.scope_boxed()).await;

        let mut app = test::init_service(
            App::new()
                .app_data(Data::clone(&pool))
                .configure(routes::config),
        )
        .await;

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
            .send_request(&mut app)
            .await;

        assert_eq!(resp.status(), StatusCode::BAD_REQUEST);
    }

    #[actix_rt::test]
    async fn test_create_seed_fails_with_invalid_tags() {
        let pool = init_test_database(|_| async { Ok(()) }.scope_boxed()).await;

        let mut app = test::init_service(
            App::new()
                .app_data(Data::clone(&pool))
                .configure(routes::config),
        )
        .await;

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
            .send_request(&mut app)
            .await;

        assert_eq!(resp.status(), StatusCode::BAD_REQUEST);
    }

    #[actix_rt::test]
    async fn test_create_seed_fails_with_invalid_quality() {
        let pool = init_test_database(|_| async { Ok(()) }.scope_boxed()).await;

        let mut app = test::init_service(
            App::new()
                .app_data(Data::clone(&pool))
                .configure(routes::config),
        )
        .await;

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
            .send_request(&mut app)
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
                        &crate::schema::plants::binomial_name.eq("Testia testia"),
                        &crate::schema::plants::common_name
                            .eq(Some(vec![Some("Testplant".to_string())])),
                    ))
                    .execute(conn)
                    .await?;
                Ok(())
            }
            .scope_boxed()
        })
        .await;

        let mut app = test::init_service(
            App::new()
                .app_data(Data::clone(&pool))
                .configure(routes::config),
        )
        .await;

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
            .send_request(&mut app)
            .await;
        assert_eq!(resp.status(), StatusCode::CREATED);

        let seed: SeedDto = test::read_body_json(resp).await;
        let resp = test::TestRequest::delete()
            .uri(&format!("/api/seeds/{}", seed.id))
            .send_request(&mut app)
            .await;

        assert_eq!(resp.status(), StatusCode::OK);
    }
}
