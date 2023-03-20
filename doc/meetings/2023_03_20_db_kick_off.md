# Meeting 2023-03-20 DB Kick-Off

_Protocolled by: Nursultan_

## Attendees:

- Nursultan
- Moritz
- Benjamin
- Thorben
- Ramzan
- Paul
- Markus
- (everyone on the mailing list is welcomed)

## Agenda:

- welcome ☺️
- goals:
  - stable migrations
  - maintenance
  - performance
- scraper/new columns:
  - permapeople.org https://github.com/ElektraInitiative/PermaplanT/issues/102
  - reinsaat.at https://github.com/ElektraInitiative/PermaplanT/issues/123
- which important decisions do we need to make?
  - plant relations: https://github.com/ElektraInitiative/PermaplanT/pull/89
  - undo
  - alternatives
  - singular vs. plural
  - ?
- which tasks do we have?
- who wants to work on which task?

## Resulting Tasks:

- Nursultan:
  - DB Design
  - feasibility study
    - undo in DB
    - canvas zoom
    - what coordinates we have in the canvas?
  - permapeople.org https://github.com/ElektraInitiative/PermaplanT/issues/102
  - reinsaat.at https://github.com/ElektraInitiative/PermaplanT/issues/123
- Ramzan:
  - guidelines
    - singular vs. plural
    - varchar vs. text
  - layers/alternatives/time support in DB (together with Nursultan)
- Moritz:
  - connect plants with seeds (together with Paul)
  - handover of scraper tasks
- Thorben:
  - create ER/SQL for users and maps tables (coordinate with Samuel)

