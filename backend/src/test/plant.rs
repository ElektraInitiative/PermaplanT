//! Tests for [`crate::controller::plants`].

#[cfg(test)]
mod tests {
    use crate::config::app;
    use crate::config::db;
    use crate::config::routes;
    use crate::model::dto::PlantsSummaryDto;
    use actix_web::App;
    use actix_web::{http::header::CONTENT_TYPE, http::StatusCode, test, web::Data};
    use dotenvy::dotenv;

    #[actix_rt::test]
    async fn test_get_all_plants_succeeds() {
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

        let resp = test::TestRequest::get()
            .uri("/api/plants")
            .send_request(&mut app)
            .await;

        assert_eq!(resp.status(), StatusCode::OK);

        assert_eq!(
            resp.headers().get(CONTENT_TYPE).unwrap(),
            "application/json"
        );

        let test_plant = PlantsSummaryDto {
            id: -1,
            binomial_name: "Testia testia".to_string(),
            common_name: Some(vec![Some("Testplant".to_string())]),
        };

        let result = test::read_body(resp).await;
        let result_string = std::str::from_utf8(&result).unwrap();

        let dtos: Vec<PlantsSummaryDto> = serde_json::from_str(result_string).unwrap();

        assert!(dtos.contains(&test_plant));
    }

    #[actix_rt::test]
    async fn test_get_one_plant_succeeds() {
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

        let resp = test::TestRequest::get()
            .uri("/api/plants/-1")
            .send_request(&mut app)
            .await;

        assert_eq!(resp.status(), StatusCode::OK);

        assert_eq!(
            resp.headers().get(CONTENT_TYPE).unwrap(),
            "application/json"
        );

        let test_plant = PlantsSummaryDto {
            id: -1,
            binomial_name: "Testia testia".to_string(),
            common_name: Some(vec![Some("Testplant".to_string())]),
        };

        let result = test::read_body(resp).await;
        let result_string = std::str::from_utf8(&result).unwrap();

        let dto: PlantsSummaryDto = serde_json::from_str(result_string).unwrap();

        assert_eq!(dto, test_plant);
    }

    #[actix_rt::test]
    async fn test_search_plants_succeeds() {
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

        let resp = test::TestRequest::get()
            .uri("/api/plants/search?search_term=Testplant&limit=10")
            .send_request(&mut app)
            .await;

        assert_eq!(resp.status(), StatusCode::OK);

        assert_eq!(
            resp.headers().get(CONTENT_TYPE).unwrap(),
            "application/json"
        );

        let test_plant = PlantsSummaryDto {
            id: -1,
            binomial_name: "Testia testia".to_string(),
            common_name: Some(vec![Some("Testplant".to_string())]),
        };

        let result = test::read_body(resp).await;
        let result_string = std::str::from_utf8(&result).unwrap();

        let dtos: Vec<PlantsSummaryDto> = serde_json::from_str(result_string).unwrap();

        assert!(dtos.contains(&test_plant));
    }
}
