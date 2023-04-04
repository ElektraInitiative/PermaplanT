# Contributing to Backend

## Migrations

### Create new migrations

You can generate new migrations with the diesel cli:

```shell
diesel migration generate migration_name
```

This will create two empty sql files that look something like this:

- migrations/20160815133237_migration_name/up.sql
- migrations/20160815133237_migration_name/down.sql

`up.sql` applies the migration and `down.sql` reverts the migration.

Now we have to write the migrations in the respective `up.sql` and `down.sql` files.

Examples:

```SQL
-- up.sql
CREATE TABLE seeds (
  id SERIAL PRIMARY KEY,
);
```

```SQL
-- down.sql
DROP TABLE seeds;
```

### Apply migrations

```shell
diesel migration run
```

### Redo migrations

This is especially useful for incremental improvements to the database.
For example if you need to change one field in one of your tables, you can change it and redo the migration.

```shell
# Redo latest migration
diesel migration redo

# Or redo all migration
diesel migration redo --all
```
