# Database

- We can use all features from PostgreSQL or [PostGIS](https://postgis.net/) and all their guidelines also apply to us
- We use `snake_case` for everything except database keywords, which should be `UPPERCASE`
- Enums should be preferred over numbers, numbers over text
- Enums names should be singular.
- Table names should be plural.
- prefer `TEXT` over `VARCHAR(n)`, don't use other variants
- We generally prefer `UUID` as primary keys, only tables that are:
  - very limited in number (in the thousands),
  - not subject to concurrent use, and
  - the primary key not part of the URL
    (like layers per map) may use `SERIAL`.
