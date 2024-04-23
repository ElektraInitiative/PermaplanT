# Backend ORM/SQL Crate

## Problem

We are currently using [Diesel](https://github.com/diesel-rs/diesel) as our ORM in Rust.

Since Diesel doesn't support `async` out of the box we will look at other alternatives and see if a switch is reasonable.  
The reason why I believe pure `async` is better in our case is that it quite difficult (especially for Rust beginners) to mix `async` and blocking code.

There might also be advantages of other ORM crates that as of writing this have not been considered.

## Constraints

1. Migrations need to be supported
2. PostGIS extension need to be supported

## Assumptions

1. Diesel is a solid choice, therefore unless other ORMs have obvious advantages differences will not be looked at in detail.

## Solutions

### [Diesel](https://github.com/diesel-rs/diesel)

Diesel currently is the most used ORM in the Rust ecosystem.  
It supports migrations written in SQL that can be executed from command line.

Diesel is the ORM we are using as of writing this decisions.

### [Diesel](https://github.com/diesel-rs/diesel) with [`diesel_async`](https://github.com/weiznich/diesel_async)

`diesel_async` is a drop-in replacement of corresponding diesel methods providing async support.

According to the author of `diesel_async` the project won't be officially released (meaning version 1.0) until Rust has better support for `async`.  
As Rust version 1.67 has no `async` traits and the likes yet performance might be slightly worse than Diesels.  
You can see the discussion about that on [Reddit](https://www.reddit.com/r/rust/comments/xpo2dd/initial_release_of_dieselasync/).

To switch from `diesel` to `diesel_async` we just would have to import different traits and make our functions `async`.  
`diesel_async` doesn't provide support for `async` migrations.
This however is not a problem as migrations are run at startup anyways and therefore has no impact.

### [SeaORM](https://github.com/SeaQL/sea-orm)

SeaORM is based upon [sqlx](https://github.com/jmoiron/sqlx) and supports `async` out of the box.  
It supports [migrations](https://www.sea-ql.org/SeaORM/docs/migration/setting-up-migration/) written in Rust.

In my opinion SeaORM provides better and more easily readable documentation out of the box.
This might however just be my personal preference.

See also [SeaORM documentation](https://www.sea-ql.org/SeaORM/docs/index/).

## Decision

We use [`diesel_async`](https://github.com/weiznich/diesel_async) with [postgis-diesel](https://github.com/vitaly-m/postgis-diesel).

See also [Diesel Documentation](https://diesel.rs/guides/).

## Rationale

At the current state the small advantages `sea-orm` might have over Diesel don't justify switching as this would involve quite a big change.
Furthermore, it seems to be slower and without support for `PostGIS`.

An interesting article to look at is <https://www.sea-ql.org/SeaORM/docs/internal-design/diesel/>.  
Apart from minor differences Diesel and SeaORM provide similar functionality.

### `async`

Both `diesel_async` and `sea-orm` provide `async` support.

This might not necessarily lead to a performance increase, but it is easier for (especially inexperienced) developers to stay in full `async`.

For example if you forget `web::block` when executing a query using Diesel you block the `async` executor (tokio in our case) until the query is finished.  
We currently have a lint warning about `async` functions that do not use await, you will therefore notice this mistake.  
However for inexperienced Rust developers it might be difficult to find out why this warning occurred as the code compiles and runs perfectly fine (especially with small loads).

This has already happened in [our code](https://github.com/ElektraInitiative/PermaplanT/pull/68/commits/167466d2661f694d6fd55b19d6b750bcba6f6028).

Furthermore it is really difficult to spot blocking functions without actually knowing the whole codebase (and therefore knowing which functions are blocking).  
As an example as of writing this every call to any of the functions in the `service` directory would block the executor.  
In a PR it is almost impossible to spot something like this when you are not the one who actually wrote the function originally.

### Performance

[Metrics by Diesel](https://github.com/diesel-rs/metrics/)

To sum up the above article:  
According to this article Diesel performs the best on basically all metrics.
Diesel_async brings a slight performance decrease.

### PostGIS

There is [postgis-diesel](https://github.com/vitaly-m/postgis-diesel) for Diesel, which works for `diesel_async` as well.  
I have found nothing similar for SeaORM.
