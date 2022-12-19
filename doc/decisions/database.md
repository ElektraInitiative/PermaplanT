# Database

## Problem

The challenges of choosing a database include finding a database that meets the specific needs and requirements of the application or project.
Permaplant will have several thousands of entries including plants.

## Constraints

- The database must support the app's needs for storing and querying plant information.
- The database should be scalable and able to handle potential future increases in users and data.
- The database should be well-supported and have a strong community.
- The database should have extra types for geometry and raster.

## Assumptions

## Considered Alternatives

- MySQL: 
[MySQL](https://www.mysql.com/de/) is a popular and well-supported open-source database
Both PostgreSQL and MySQL are relational databases however, PostgreSQL is more flexible when it comes to data types and allows for more advanced data types, such as arrays and JSON. 
This can be useful for applications like Permaplant that may have more complex data structures.
- MongoDB: 
[MongoDB](https://www.mongodb.com/) is a popular NoSQL database.
The data for the app is likely to be structured and have relationships between different entities, such as field plants, trees, and landscapes.
A relational database would be more suited.

## Decision

We will use [PostgreSQL](https://www.postgresql.org/) as the database for the Permaplant app in addition with a [PostGIS](https://postgis.net/) extension for spatial queries.

## Rationale

PostgreSQL is a well-supported and widely-used open-source database that is capable of handling the complex data structures and querying needs of the Permaplant app. 
It is also scalable and has a strong community, making it a good choice for the app's database needs.

PostGIS is an open-source extension for PostgreSQL that enables the storage and manipulation of spatial data, such as points, lines, and polygons. 
It provides various functions and operators for performing spatial queries. 
As almost all entries in the database include their coordinates, PostGIS is a valuable tool for querying and working with spatial data.

## Implications

- The app will need to be configured to use PostgreSQL as its database.
- Any queries or data access code in the app will need to be updated to use PostgreSQL-specific syntax and features.
- The app will need to be tested with PostgreSQL to ensure compatibility and performance.

## Related Decisions

## Notes
