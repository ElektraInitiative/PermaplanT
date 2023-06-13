# Crosscutting Concepts

We handle crosscutting concepts in [the chapter Guidelines](../guidelines).

A few concepts we don't need/avoid/keep very simple are listed here:

- persistency: only via database
- transaction handling: shouldn't be needed (at most within endpoints)
- i18n is completely handled by frontend (see frontend documentation)
