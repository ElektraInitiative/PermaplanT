# Database

- use all features from PostgreSQL or [PostGIS](https://postgis.net/) and all their guidelines
- use `snake_case` for everything except database keywords, which should be `UPPERCASE`
- prefer enums over numbers, numbers over text
- enums names should be singular
- table names should be plural
- prefer IDs over `TEXT` for plants
- prefer `TEXT` over `VARCHAR(n)`, don't use other variants
- prefer `UUID` as primary keys, except for tables that are not subject to concurrent use (backend creates new items)
- prefer `BIGSEQUENCE` over `SEQUENCE` except for users/maps where 2 billion is obviously enough
