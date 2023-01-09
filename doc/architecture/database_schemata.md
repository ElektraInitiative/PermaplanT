
# Database Schemata

## Seeds
Tag and Quality in this case are enum. 
Postgres supports [enums](https://www.postgresql.org/docs/current/datatype-enum.html) so it is easy to define a static set of values. 

```mermaid
erDiagram

tag {
  Leaf crops
  Fruit crops
  Root crops
  Flowering crops
  Herbs
  Other
}

quality {
  Organic
  Not organic
  Unknown
}

seeds {
  INT id PK
  tag[] tag "NOT NULL"
  VARCHAR type "NOT NULL"
  INT plant_id "NOT NULL"
  SMALLINT harvest_year "NOT NULL"
  DATE use_by
  VARCHAR origin
  VARCHAR flavor
  INT yield
  INT quantity
  quality quality
  INT price
  INT generation
  VARCHAR notes
}

plants {
  INT id PK
  tag[] tag "NOT NULL"
  VARCHAR type "NOT NULL"
  VARCHAR synonym
  DATE sowing
  INT sowing_depth
  INT germination_temperature
  INT prick_out
  INT transplant
  INT row_spacing
  INT plant_density
  INT germination_time
  INT harvest_time
  VARCHAR location
  VARCHAR care
  INT height
}


plants ||--o{ seeds : ""
```