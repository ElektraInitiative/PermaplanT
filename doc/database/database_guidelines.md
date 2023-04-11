# Database Guidelines

This document outlines the conventions and guidelines for designing and maintaining a well-structured and organized database.
Please follow these guidelines to ensure consistency and ease of use across the database.

## 1. Table Names

**Plural**: Table names should be plural to accurately represent the multiple rows of data they contain.
For example: `users` and `plants`.

## 2. Enum Names

**Singular**: Enum names should be singular, as they represent a single value within a predefined set of values.
For example: `color` and `type`.

## 3. Naming Conventions

**Snake Case**: Use snake_case for all database objects (tables, columns, enums, etc.) to maintain consistency and readability.
Snake case involves using lowercase letters and underscores to separate words.
For example: `first_name` and `last_change`. 

**Functions**: Built-in functions and user-defined functions should follow the naming conventions of the specific database management system being used.
In our case we use the PostgreSQL database which also uses **snake_case** for function names.

### Exceptions:

**Database Keywords**: Keywords specific to the database management system (e.g., SELECT, FROM, WHERE) should be written in uppercase to distinguish them from user-defined objects.

## 4. TEXT vs VARCHAR

When choosing between **TEXT** and **VARCHAR(n)** in PostgreSQL please consider the following things:
 - Unlimited length: Use **TEXT** when there's no need to enforce a length limit.
 - Enforcing length: Use **VARCHAR(n)** when you want to enforce a specific maximum length.
 - Consistency: Be consistent in your use of **TEXT** and **VARCHAR(n)** across the database.
