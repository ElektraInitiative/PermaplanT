# Logging

The backend uses [env_logger](https://docs.rs/env_logger/latest/env_logger/) together with [log](https://docs.rs/log/latest/log/) as a logging framework.

`env_logger` allows to configure logging via the environment variable `RUST_LOG`.

## Changing the Logging Level

To change the log level you can do one of the following:

- Run the backend with e.g. `RUST_LOG='backend=debug,actix_web=info' cargo run` to change the log level of our code to debug
- Change the variable `RUST_LOG` in the .env file

## Log Messages

- Use detailed logging messages for easy troubleshooting.
  It must be clear what should have happened and what actually happened.
- Include relevant context, parameters, error codes etc.
- Log only if actually needed.
  Exceptions: all calls of endpoints and SQL queries should be completely logged (level: debug).
- Always use the lowest applicable logging level.

## Log Levels

Available logging levels are:

- **error**  
  Use for events disrupting normal operations.
- **warn**  
  Apply for potentially harmful situations or undesirable yet operational states.
- **info**  
  Use to monitor the essential flow of the application, capturing important operations like successful user authentications.
- **debug**  
  Reserved for development or debugging; includes detailed updates, states of critical application points, or SQL queries.
- **trace**  
  Use for granular logging, such as step-by-step function execution, to aid in complex issue diagnosis.

## How to add Logging

To log you can simply call the macros in the `log` crate.

For example to log using the debug level:

```rust,ignore
log::debug!("This is my variable: {}", some_variable);
```

As you can see the behavior is the same as it is for example for `println!()`.

## Log SQL queries

SQL queries can be converted to something that can be logged using [debug_query](https://docs.rs/diesel/latest/diesel/fn.debug_query.html).

```rust,ignore
let query = diesel::delete(seeds::table.find(id));
debug!("{}", debug_query::<Pg, _>(&query));
query.execute(conn).await
```
