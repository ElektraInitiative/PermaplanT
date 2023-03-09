#[cfg(test)]
mod tests {
    use std::vec;

    use crate::config::app;
    use crate::config::db;
    use crate::config::routes;
    use crate::models::dto::new_seed_dto::NewSeedDTO;
    use crate::models::dto::seed_dto::SeedDTO;
    use crate::models::r#enum::quantity::Quantity;
    use crate::models::response::ResponseBody;
    use actix_web::App;
    use actix_web::{http::StatusCode, test, web::Data};
    use dotenvy::dotenv;

    #[actix_rt::test]
    async fn test_create_seed_fails_with_invalid_quantity() {
        dotenv().ok();

        let app_config = app::Config::from_env().expect("Error loading configuration");
        let pool = db::init_pool(&app_config.database_url);
        let pool = Data::new(pool.clone());

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
        dotenv().ok();

        let app_config = app::Config::from_env().expect("Error loading configuration");
        let pool = db::init_pool(&app_config.database_url);
        let pool = Data::new(pool.clone());

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
        dotenv().ok();

        let app_config = app::Config::from_env().expect("Error loading configuration");
        let pool = db::init_pool(&app_config.database_url);
        let pool = Data::new(pool.clone());

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
        dotenv().ok();

        let app_config = app::Config::from_env().expect("Error loading configuration");
        let pool = db::init_pool(&app_config.database_url);
        let pool = Data::new(pool.clone());

        let mut app = test::init_service(
            App::new()
                .app_data(Data::clone(&pool))
                .configure(routes::config),
        )
        .await;

        let new_seed = NewSeedDTO {
            name: "tomato test".to_string(),
            variety: Some("testvariety".to_string()),
            plant_id: Some(1),
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

        let body: ResponseBody<SeedDTO> = test::read_body_json(resp).await;
        let seed = body.data;
        let resp = test::TestRequest::delete()
            .uri(&format!("/api/seeds/{}", seed.id))
            .send_request(&mut app)
            .await;

        assert_eq!(resp.status(), StatusCode::OK);
    }
}
