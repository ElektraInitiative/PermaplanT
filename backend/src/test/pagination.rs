//! Tests for [`crate::db::pagination`].

use crate::{
    model::{
        dto::{Page, SeedDto},
        r#enum::quantity::Quantity,
    },
    test::test_utils::{init_test_app, init_test_database},
};
use actix_web::{http::StatusCode, test};
use diesel::ExpressionMethods;
use diesel_async::{scoped_futures::ScopedFutureExt, RunQueryDsl};

#[actix_rt::test]
async fn test_seeds_pagination_succeeds() {
    let pool = init_test_database(|conn| {
        async {
            // Generate 15 test entries
            let values = (0..15)
                .map(|i| {
                    (
                        crate::schema::seeds::id.eq(-1 * i),
                        crate::schema::seeds::name.eq(format!("Testia {i}")),
                        crate::schema::seeds::harvest_year.eq(2022),
                        crate::schema::seeds::quantity.eq(Quantity::Enough),
                    )
                })
                .collect::<Vec<_>>();

            diesel::insert_into(crate::schema::seeds::table)
                .values(values)
                .execute(conn)
                .await?;
            Ok(())
        }
        .scope_boxed()
    })
    .await;
    let app = init_test_app(pool).await;

    // Test default page length
    let resp = test::TestRequest::get()
        .uri("/api/seeds")
        .send_request(&app)
        .await;
    assert_eq!(resp.status(), StatusCode::OK);
    let result = test::read_body(resp).await;
    let result_string = std::str::from_utf8(&result).unwrap();
    let page: Page<SeedDto> = serde_json::from_str(result_string).unwrap();
    assert_eq!(page.results.len(), 10); // Default length is 10.

    // Test second page
    let resp = test::TestRequest::get()
        .uri("/api/seeds?page=2")
        .send_request(&app)
        .await;
    assert_eq!(resp.status(), StatusCode::OK);
    let result = test::read_body(resp).await;
    let result_string = std::str::from_utf8(&result).unwrap();
    let page: Page<SeedDto> = serde_json::from_str(result_string).unwrap();
    assert_eq!(page.results.len(), 5); // Total of 15 values in db. First page is 10. Second page is 5.

    // Test number of results per page
    let resp = test::TestRequest::get()
        .uri("/api/seeds?per_page=2")
        .send_request(&app)
        .await;
    assert_eq!(resp.status(), StatusCode::OK);
    let result = test::read_body(resp).await;
    let result_string = std::str::from_utf8(&result).unwrap();
    let page: Page<SeedDto> = serde_json::from_str(result_string).unwrap();
    assert_eq!(page.results.len(), 2); // Set to 2 per page.

    // Test page to large for number of records in db
    let resp = test::TestRequest::get()
        .uri("/api/seeds?page=100")
        .send_request(&app)
        .await;
    assert_eq!(resp.status(), StatusCode::OK);
    let result = test::read_body(resp).await;
    let result_string = std::str::from_utf8(&result).unwrap();
    let page: Page<SeedDto> = serde_json::from_str(result_string).unwrap();
    assert_eq!(page.results.len(), 0); // Returns 0 once no more values are found for the page.
}
