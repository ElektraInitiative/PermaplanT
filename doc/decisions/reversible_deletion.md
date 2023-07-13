# Reversible deletion of database entities

## Problem

PermaplanT provides functionality not only to delete entities created by the user, e.g. plants, maps, etc. but also to restore them within a period of time.
This is required to prevent the accidental deletion of entities and to allow users to undo their actions.
The challenge is to keep the deleted entities for a certain period of time, e.g. 1 month, and then remove them from the database on a scheduled basis.
Since there is no built-in time-based job handling feature(like cron jobs in Unix systems) in PSQL, we cannot simply mark entries to be removed and expect them to fade away.

## Constraints

1. The decision applies only to the map and plant entities for the time being.

## Assumptions

N/A

## Solutions

### PSQL partitioning

Partitioning is a feature of PSQL that allows to split a table into smaller tables based on a certain column value.
If we would proceed with the partitioning based on a deletion timestamp column, we can run the partitioning process either manually every day, which is a 100% no-go for us, or assign it to a PSQL trigger.
Unfortunately, there are only on- INSERT/UPDATE/DELETE and no time-based triggers in PSQL.
Therefore, we could only run the partitioning e.g. on the insertion of new entries, which can occur within a day/week/month or even a year.
This means that some entries marked to be removed could stay in the database for a longer period than they should.

## Decision

In order to keep the entries for a certain period of time, we introduce a new column in the database tables, e.g. `deleted_at`, which will contain the timestamp of the deletion.
The deletion of the entities will be handled either by a cron job on the server level or a scheduled task in the backend.

## Rationale

PSQL has no built-in time-based job handling feature, therefore it should be handled either on the server level or in the backend.

## Implications

## Related Decisions

## Notes

- Related [mape create](../usecases/done/map_creation.md)
- Related [map delete](../usecases/assigned/map_deletion.md)
- Example of the deletion query:
  - `DELETE FROM plants WHERE deleted_at IS NOT NULL and deleted_at < NOW() - INTERVAL '1 month'`
