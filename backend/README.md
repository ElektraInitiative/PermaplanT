# PermaplanT Backend

## Requirements

- Rust 1.66.1
- PostgreSQL 14.6

## Installation

1. Rename `.env.sample` to `.env` and enter the data according to your setup.

2. Install Diesel CLI:

``` shell
cargo install diesel_cli --no-default-features --features postgres
```

3. Run the diesel setup, this makes sure that diesel will create the database if it doesn't exist yet and will run all migrations.

``` shell
diesel setup
```

4. Start the server:

``` shell
cargo run
```

## Usage

Now the server is running and will start listening at <http://localhost:8080/> (or whichever port you specified in `.env`).

## Migrations

### Create new migrations

You can generate new migrations with the diesel cli:

``` shell
diesel migration generate migration_name
```

This will create two empty sql files that look something like this:

- migrations/20160815133237_migration_name/up.sql
- migrations/20160815133237_migration_name/down.sql

`up.sql` applies the migration and `down.sql` reverts the migration.

Now we have to write the migrations in the respective `up.sql` and `down.sql` files.

### Apply migrations

``` shell
diesel migration run
```

### Revert migrations

``` shell
# Revert latest migration
diesel migration revert

# Or revert all migration
diesel migration revert --all
```

### Redo migrations

``` shell
# Redo latest migration
diesel migration redo

# Or redo all migration
diesel migration redo --all
```

### Type Safety

In order to ensure type safety between the TypeScript frontend and Rust backend, we use [typeshare](https://github.com/1Password/typeshare) to synchronize our Rust type definitions with TypeScript.
To enable this, you need to install the typeshare cli:

``` shell
cargo install typeshare-cli
```

Afterwards we can create bindings:

``` shell
typeshare ./ --lang=typescript --output-file=../frontend/src/bindings/rust_ts_definitions.ts
```

Or directly in the frontend:

``` shell
# change directory into frontend first
npm run generate-api-types
```

Now we can find our rust-typescript bindings under `/frontend/src/bindings` and use them directly in our TypeScript codebase.
