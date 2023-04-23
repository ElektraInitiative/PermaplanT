# Backend Architecture

## Structure

The backend is split using a 3-layer architecture with controller, service and persistence layer.  
Controller and service layer can be found in their respective folders.  
The persistence layer is currently part of `model/entity/`.

### Controller

The controller layer contains all endpoints of the application.  
The actual routes are defined in `config/routes/` while the controller layer only contains the actual implementation of the endpoints.

Actix passes the data the application is acting upon (in our case a pool of connections to the database) to the endpoints.  
We then 'forward' the pool to the service layer where a connection is retrieved from the pool.  
The persistence layer then uses that connection to make calls to the database.

The endpoints are automatically documented using [utoipa](https://github.com/juhaku/utoipa) which can generated OpenAPI documentation from code.

### Service

The service layer is responsible for handling our business logic as well as mapping entities and DTOs.

### Persistance

The persistance layer is responsible for making connections to the database and retrieving/updating the state of the database.

### Model

The `model/` folder contains the data PermaplanT is acting upon.  
Entities are shared with the database using the ORM [diesel](https://github.com/diesel-rs/diesel).  
DTOs are shared with the frontend using [typeshare](https://github.com/1Password/typeshare).  
The mapping of entities to DTOs occurs in the service layer.

The files `entity.rs` and `dto.rs` in `model` contain the actual structs.
That way you have a quick overview of what the data looks like without having to navigate multiple files.  
The actual implementation (mappings, ...) is separate from the structs to reduce the size of the files.

### Tests

Tests are split into unit and integration tests (see [here](../tests) for reference).

Integration tests can be found in `test/`.  
Unit tests can be found in the modules they are supposed to test.

## Code documentation

The code documentation of the backend can be built using `cargo doc --open`.  
There will also be a web page available (WIP).

You can find a more detailed explanation of which modules to what there.

## API documentation

The API documentation can be viewed by running the backend with `cargo run` and then navigating to <http://localhost:8080/doc/api/swagger/ui/>.  
It is automatically built using [utoipa](https://github.com/juhaku/utoipa).
