# Database

This README.md file provides a comprehensive documentation of the database, including its structure, guidelines, and conventions.
The purpose of this documentation is to ensure consistency, readability, and ease of use for all users and developers interacting with the database.

## Table of Contents

1. [Introduction](#introduction)
2. [Database Schema](#database-schema)
3. [Entity-Relationship Diagram](#entity-relationship-diagram)
4. [Table Descriptions](#table-descriptions)
5. [Database Guidelines](#database-guidelines)
6. [Contributing](#contributing)

## Introduction

This database is designed to store and manage information related to plants, their properties, cultivation details, environmental preferences, and more.
It follows a set of guidelines and conventions to ensure consistency and maintainability.

## Database Schema

The database schema consists of multiple tables and relationships, including:

- `plants`
- `seeds`
- `species`
- `genera`
- `subfamilies`
- `families`

Enums are used to represent predefined sets of values, such as:

- `tag`
- `quantity`
- `quality`

For further information, see [Database Schemata](./database_schemata.md).

## Entity-Relationship Diagram

The ER diagram provides a visual representation of the tables, relationships, and cardinalities within the database.
This diagram can be created using Mermaid syntax and then viewed using a Mermaid-compatible viewer.

## Table Descriptions

Each table in the database has a detailed description that includes the column names, data types, examples, initial rules, and descriptions.
For example, the `plants` table contains information about plant species, their binomial names, common names, family, genus, cultivation details, environmental preferences, and much more.

## Database Guidelines

To ensure consistency and ease of use, the following guidelines should be followed when working with the database:

1. **Table Names**: Table names should be plural to accurately represent the multiple rows of data they contain.
2. **Enum Names**: Enum names should be singular, as they represent a single value within a predefined set of values.
3. **Naming Conventions**: Use snake_case for all database objects (tables, columns, enums, etc.) to maintain consistency and readability.

For further information, see [Database Guidelines](./database_guidelines.md).

## Contributing

Contributions to the database are welcome.
Please ensure that any changes follow the established guidelines and conventions outlined in this documentation.
If you have any questions or need assistance, please contact the project maintainer.

---
