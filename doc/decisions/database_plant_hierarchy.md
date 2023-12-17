# Database Plant Hierarchy

## Problem

The challenge is to define the structure of the database in a way that the data:

- can be easily queried so the most specific data according the taxonomy is retrieved and
- updated without redundancy (e.g. setting attributes for a whole family).

Here we will discuss how the hierarchy should be defined in the database.

## Constraints

- The database structure should represent the simplified taxonomy we need for PermaplanT.
- There must be a unique identifier for later updates of the database.

## Assumptions

- Performance of the database is efficient enough.
- Subfamilies will not be introduced by PFAF/Permapeople.
- A new plant added by us won't need subfamilies.
- We don't need convar between species and variety.

## Considered Alternatives

### Inheritance feature of PSQL

Inheritance cannot solve the challenge.
See the [PSQL documentation](https://www.postgresql.org/docs/current/ddl-inherit.html) as cited here:

> Inheritance does not automatically propagate data from INSERT or COPY commands to other tables in the inheritance hierarchy.

> All check constraints and not-null constraints on a parent table are automatically inherited by its children, unless explicitly specified otherwise with NO INHERIT clauses. Other types of constraints (unique, primary key, and foreign key constraints) are not inherited.

> Table inheritance is typically established when the child table is created, using the INHERITS clause of the CREATE TABLE statement.

So the inheritance is useful to deal with complex DDL structure on the startup, but will not help us to avoid bulk operations e.g. updating a column for every `variety` in the entire `genus`

### One table per taxonomy rank and one for concrete plants.

[Example](example_migrations/one-table-per-taxonomy)

Pros:

- Schema is easy to understand.

Cons:

By splitting the taxonomy ranks into multiple tables we loose the ability to have simple foreign keys to these when defining plant relationships.
There would be two approaches to alleviate this.

- Manage multiple nullable foreign keys and make sure that exactly one of them is set.
  Would lead to complex validations for inserts and updates.
- Generalize it to a self-managed compound foreign key with a table name and id.
  We would lose referential integrity here.

### One table for taxonomy ranks and one for concrete plants.

[Example](example_migrations/taxonomy-ranks-and-concrete-plants)

Pros:

- Inserting new plants is easy.

Cons:

- Attribute overrides can only be done on variety or cultivar level.
- More complex insert and update logic.
  When a species/variety is added or updated the columns can't just be set.
  First we need to make sure all higher levels are in the table.
  Then we need to check for each column value if there is a higher rank that already defines the same value.
  Only if we can't find a match the value should be written.

### All ranks in one table.

[Example](example_migrations/normalized-plants-and-ranks)

Pros:

- Flexible and extendable.
- Allow attribute overrides on arbitrary level.

Cons:

- Almost everything in the plants table needs to be nullable.
- More complex insert and update logic.

## Decision

- We go with the last option "All ranks in one table" as described [in our documentation](../database/hierarchy.md).
- We rename "binomial name" to "unique name" and guarantee that it is unique.
- We add "cultivar" as lowest rank.
- We remove the rank "subfamily".

For details on the schema see this [example SQL](example_migrations/normalized-plants-and-ranks/2023-04-07-130215_plant_relationships/up.sql.md)
Here are some [example queries](example_migrations/normalized-plants-and-ranks/example_queries.sql.md)

## Rationale

Having everything in one table makes maintenance of the database easier:
Attributes of plants, and especially icons, can be defined on any rank level.

We need a unique name (across all entries) for updates.
We call it unique name (and not scientific or Latin) because cultivar:

- don't have a scientific name.
- don't have a Latin name.

There are no attributes which need a rank higher than family, see:

- https://www.youtube.com/watch?v=0hAhy30_6fc
- https://www.try-db.org/TryWeb/Home.php
- Lüttge, Kluge, Bauer (2005): Botanik. Wiley-vch Verlag.
- Das große Buch der Biologie.

Subfamily gets removed because:

- is currently not present in the database.
- the traits specific to subfamilies are not very important to PermaplanT.
- a new plant assigned to a subfamily can be assigned (manually) to the family as well.

## Implications

- [ ] Unique names must be unique.
- [ ] Unique names must be carefully renamed according to our schema.
- [ ] Updates must be done carefully to de-duplicate information.

## Related Decisions

NA

## Notes

The relationships schemata shown in these examples all have a column that distinguished between companions and antagonists.
Looking at the example queries for selecting companion plants for groups it might be more efficient to split this table.
