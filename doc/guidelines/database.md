# Database

- We can use all features from PostgreSQL or [PostGIS](https://postgis.net/) and all their guidelines also apply to us
- We use `snake_case` for everything except database keywords, which should be `UPPERCASE`
- Enums should be preferred over numbers, numbers over text
- Enums names should be singular.
- Table names should be plural.
- prefer `TEXT` over `VARCHAR(n)`, don't use other variants
- prefer `UUID` as primary keys, except for tables that are not subject to concurrent use (backend creates new items)
- prefer `BIGSEQUENCE` over `SEQUENCE` except for users/maps where 2 billion is obviously enough
