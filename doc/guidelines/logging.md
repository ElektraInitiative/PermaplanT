# Logging

The backend uses [env_logger](https://docs.rs/env_logger/latest/env_logger/) together with [log](https://docs.rs/log/latest/log/) as a logging framework.

`env_logger` allows to configure logging via environment variables more specifically the env variable `RUST_LOG`.

## Changing the log level

To change the log level you can do one of the following:

- Run the backend with e.g. `RUST_LOG='backend=debug,actix_web=info' cargo run` to change the log level of our code to debug
- Change the variable `RUST_LOG` in the .env file

As show you can set the log level of certain crates using the syntax `RUST_LOG='*crate*=*log_level*'`.

## How to add logging

To log you can simply call the macros in the `log` crate.

For example to log using the debug level:

```rust,ignore
log::debug!("This is my variable: {}", some_variable);
```

As you can see the behavior is the same as it is for example for `println!()`.

Available logging levels are:

- **error**  
  Use for events disrupting normal operations. Ensure detailed messages for easy troubleshooting.
- **warn**  
  Apply for potentially harmful situations or undesirable yet operational states. It could include, for instance, deprecation warnings.
- **info**  
  Use to monitor the general flow of the application, capturing routine operations like successful database connections and user authentications.
- **debug**  
  Reserved for development or debugging; includes detailed updates, states of critical application points, or SQL queries.
- **trace**  
  Use for granular logging, such as step-by-step function execution, to aid in complex issue diagnosis.

## Log SQL queries

SQL queries can be converted to something that can be logged using [debug_query](https://docs.rs/diesel/latest/diesel/fn.debug_query.html).

```rust,ignore
let query = diesel::delete(seeds::table.find(id));
debug!("{}", debug_query::<Pg, _>(&query));
query.execute(conn).await
```

You can then log SQL queries using debug level for the backend: `RUST_LOG='backend=debug' cargo run`
