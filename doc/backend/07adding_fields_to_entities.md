# Steps to add a Field to Entities

1. Create a migration  
   `cd backend && diesel migration generate my_new_migration`  
   This will create `up.sql` and `down.sql` inside a new migration folder under `/backend/migrations/`  
   `up.sql` should create all necessary tables, columns, constraints as well as modify data if necessary  
   `down.sql` should undo all changes from `up.sql`

2. Run the migration  
   `make migration`  
   During development you can run `make migration-redo` to run `down.sql` and `up.sql` of the most recent migration

3. Add new field to Entity  
   e.g. extend the `Plants` entity in [entity.rs](https://blob.permaplant.net/master/backend/src/model/entity.rs)

4. (Optional) Update the schema patch  
   If you see an error message similar to `error applying hunk #2`, you will have to [update schema.patch](https://blob.permaplant.net/master/doc/backend/06updating_schema_patch.md)

5. Add field to DTOs (where applicable)  
   e.g. extend `PlantsSummaryDto` in [dto.rs](https://blob.permaplant.net/master/backend/src/model/dto.rs)

6. Update usages and trait implementations of DTOs (where applicable)  
   e.g. implementation of the `From` Trait for `PlantsSummaryDto` in [plants_impl.rs](https://blob.permaplant.net/master/backend/src/model/dto/plants_impl.rs)  
   IMPORTANT: The order of the fields in the DTOs must be the same as in the corresponding entity.

7. Update database schema documentation  
   Review the documentation under [/doc/database/schemata](https://blob.permaplant.net/master/doc/database/schemata) and make the necessary changes.

8. Extend API documentation  
   Review the swagger API documentation under [http://localhost:8080/doc/api/swagger/ui/](http://localhost:8080/doc/api/swagger/ui/)  
   For better understanding of the API endpoints that uses the modified DTOs, consider adding an `#[schema(example = "...")]` attribute macro to the DTO  
   For example:

```
pub struct TimelineDto {
    #[schema(example = "{ \"2020\": { \"additions\": 7, \"removals\": 7 } }")]
    pub years: HashMap<String, TimelineEntryDto>,
    [...]
}
```
