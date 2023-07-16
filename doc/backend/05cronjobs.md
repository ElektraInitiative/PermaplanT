# Cronjobs

Cronjobs in the backend can be added in the function `start_cronjobs` in the `main.rs` file.  
This should be done by spawning a new tokio thread via `tokio::spawn(cronjob_function());`.

The function itself should never return.  
This can be done by using the following function signature `fn cronjob_function() -> !` and using a loop inside the function itself.

Example database cronjob:

```rust,compile_fail
pub async fn cleanup(pool: Pool) -> ! {
    loop {
        tokio::time::sleep(Duration::from_secs(60)).await;

        let query = diesel::delete(<some_constraint>);
        debug!("{}", debug_query::<Pg, _>(&query));

        match pool.get().await {
            Ok(mut conn) => match query.execute(&mut conn).await {
                Ok(delete_rows) => log::info!("Removed {delete_rows} entries"),
                Err(e) => log::error!("Failed to execute query: {}", e),
            },
            Err(e) => {
                log::error!("Failed to get connection from pool: {}", e);
            }
        }
    }
}
```
