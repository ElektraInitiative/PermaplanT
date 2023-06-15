# Example queries

## Get all plants with their hierarchy information

```sql
SELECT *
  FROM plant_detail
  LEFT JOIN genus
            ON plant_detail.genus = genus.name
  LEFT JOIN subfamily
            ON plant_detail.subfamily = subfamily.name
  LEFT JOIN family
            ON plant_detail.family = family.name;
```

## Insert a relation between a plant with a specific genus and a specific family

```sql
INSERT INTO relations (from_id, from_type, to_id, to_type, relation_type, relation_strength)
VALUES (1, 'genus', 156, 'family', 'companion', 3);
```

## Get all plants that are companions to a specific family

```sql
SELECT p.id,
       p.binomial_name,
       p.genus,
       p.family,
       p.subfamily,
       r.*
  FROM plant_detail p
  LEFT JOIN genus
            ON p.genus = genus.name
  LEFT JOIN subfamily
            ON p.subfamily = subfamily.name
  LEFT JOIN family
            ON p.family = family.name
  JOIN relations r
       ON r.relation_type = 'companion' AND r.to_type = 'family' AND r.to_id = 156 AND
          CASE
              WHEN r.from_type = 'plant' THEN r.id = p.id
              WHEN r.from_type = 'genus' THEN r.id = genus.id
              WHEN r.from_type = 'subfamily' THEN r.id = subfamily.id
              WHEN r.from_type = 'family' THEN r.id = family.id
              END;
```
