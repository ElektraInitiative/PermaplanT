use actix_web::{
    web::{Data, Json, Path},
    HttpResponse, Result,
};

use crate::{
    config::db::Pool,
    constants,
    models::{response::ResponseBody, seed::NewSeed},
    services,
};

pub async fn create(new_seed_json: Json<NewSeed>, pool: Data<Pool>) -> Result<HttpResponse> {
    match services::seed_service::create(new_seed_json.0, &pool) {
        Ok(_) => Ok(HttpResponse::Created()
            .json(ResponseBody::new(constants::MESSAGE_OK, constants::EMPTY))),
        Err(err) => Ok(err.response()),
    }
}

pub async fn delete_by_id(path: Path<i32>, pool: Data<Pool>) -> Result<HttpResponse> {
    match services::seed_service::delete_by_id(*path, &pool) {
        Ok(_) => {
            Ok(HttpResponse::Ok().json(ResponseBody::new(constants::MESSAGE_OK, constants::EMPTY)))
        }
        Err(err) => Ok(err.response()),
    }
}

#[cfg(test)]
mod tests {
    use std::vec;

    use crate::config::app;
    use crate::config::db;
    use crate::config::routes;
    use crate::models::seed::NewSeed;
    use actix_cors::Cors;
    use actix_web::App;
    use actix_web::{http, http::StatusCode, test, web::Data};
    use dotenvy::dotenv;

    #[actix_rt::test]
    async fn test_create_seed_ok() {
        dotenv().ok();

        let app_config = app::Config::from_env().expect("Error loading configuration");
        let pool = db::config(&app_config.database_url);
        let pool = Data::new(pool.clone());

        let mut app = test::init_service(
            App::new()
                .wrap(
                    Cors::default() // allowed_origin return access-control-allow-origin: * by default
                        .allowed_origin("http://127.0.0.1:5173")
                        .allowed_origin("http://localhost:5173")
                        .send_wildcard()
                        .allowed_methods(vec!["GET", "POST", "PUT", "DELETE"])
                        .allowed_header(http::header::CONTENT_TYPE)
                        .max_age(3600),
                )
                .app_data(Data::clone(&pool))
                .configure(routes::config),
        )
        .await;

        let new_seed = NewSeed {
            id: Some(-1),
            name: "tomato2".to_string(),
            variety_id: 1,
            harvest_year: 2022,
            quantity: "Nothing".to_string(),
            tags: vec!["Leaf crops".to_string()],
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

        let resp = test::TestRequest::delete()
            .uri("/api/seeds/-1")
            .send_request(&mut app)
            .await;

        assert_eq!(resp.status(), StatusCode::OK);
    }
}
