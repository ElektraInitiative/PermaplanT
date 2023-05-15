# Search Plants

## Problem

We want to provide a usable search for plants that goes beyond searching for substring in various plant names.
Partial matches of the following fields should be returned.

- Unique name
- Common names
- Edible uses

## Constraints

1. Results should be fetched in a single query in order to utilize pagination.
2. Exact matches should be ranked high.
3. The users language preference should be taken into account when ranking.
4. Matches in names should have a higher rank than those in edible uses.

## Assumptions

1. Postgres will perform reasonable with these search queries.
2. Using postgres or even extension specific functions with diesel is possible and maintainable.

## Solutions

### Postgres Full Text Search

https://www.postgresql.org/docs/current/textsearch.html

Postgres provides built in full text search functionality.

Pros:

- Easy to use.
- No additional extensions needed.

Cons:

- No ability to match parts of compound words.
  E.g. Searching for "Kirsche" wouldn't return a row containing "Frühkirsche".
- Built in ranking works by count the occurrences of matched words in a document.
- Seems better suited for searching through large text documents.

### Partial Match With String Distance

https://www.postgresql.org/docs/14/fuzzystrmatch.html#id-1.11.7.24.7

Here a match would be found with an `ILIKE` query and the results ranked by measuring
the Levenshtein distance between the query string and the matched word in the column.
This distance describes the number of character changes required to transform one string
into the other.
A language-preference based factor can be applied to the rank depending on the language
of the matched column.

Pros:

- Very precise matching with very few irrelevant results.
- Computationally simple and fast.

Cons:

- Wouldn't be able to catch typos.
- May miss relevant results where only a part of the strings match.
  E.g. a search for "Frühkirsche" would not return "Spätkirsche".

### Partial Match With String Similarity

https://www.postgresql.org/docs/current/pgtrgm.html#id-1.11.7.44.6

A match can be found by using the string similarity operator `%` from the `pg_trgm` extension.
This similarity is calculated by counting the number of shared trigrams between the strings.
Pairs that have a similarity above a certain threshold would be matched.
A trigram is a sequence of three consecutive characters in a string.
This similarity can further be used to calculate a ranking in a similar manner as described
in [string distance](#partial-match-with-string-distance).

Pros:

- Ability to handle spelling mistakes in the query string·
- Loose matching mechanism returns related results.
  E.g. a search for "Frühkirsche" would also return "Spätkirsche".

Cons:

- Can produce very many results for short query strings.
- Computationally more expensive than other options.
  Can be alleviated by creating an index on the relevant columns.
  https://www.postgresql.org/docs/current/pgtrgm.html#id-1.11.7.44.8
- Less useful for very long query strings as there will be fewer common trigrams.

## Decision

## Rationale

## Implications

-

## Related Decisions

- [Database](database.md)

## Notes
