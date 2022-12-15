# Database

## Problem

The challenges of choosing a database include finding a database that meets the specific needs and requirements of the application or project.
Permaplant will have several thousands of entries including plants.

## Constraints

- The database must support the app's needs for storing and querying plant information.
- The database should be scalable and able to handle potential future increases in users and data.
- The database should be well-supported and have a strong community.

## Assumptions

## Considered Alternatives

- MySQL: While MySQL is a popular and well-supported open-source database
- MongoDB: MongoDB is a popular NoSQL database

## Decision

We will use PostgreSQL as the database for the Perma Plan(t) app.

## Rationale

PostgreSQL is a well-supported and widely-used open-source database that is capable of handling the complex data structures and querying needs of the Perma Plan(t) app. It is also scalable and has a strong community, making it a good choice for the app's database needs.

## Implications

- The app will need to be configured to use PostgreSQL as its database.
- Any queries or data access code in the app will need to be updated to use PostgreSQL-specific syntax and features.
- The app will need to be tested with PostgreSQL to ensure compatibility and performance.

## Related Decisions

## Notes
