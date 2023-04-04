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

## Notes:

- welcome and intoduction of the participants
- postgis data should coordinate with real world
- permapeople.org have more recent plants information than practicalplants
  - suggested to sync the data with permapeople.org and our database bi-directionally
- there will be a meeting with PostGIS expert for sure
- discussion about the coordinate system of the map
  - which coordinates are used in the database?
  - which coordinates are used in the frontend by the canvas? e.g. zoom-in
- 5D coordinates: x, y, z, time and the alternatives
- 5D should be transformed into 2D
- lazy loading of the map
  - initial idea was to load only visible elements of the map on the startup
  - however, for the offline mode we will need additional data e.g. plants information. not fixed yet
- offline functionality is limited in respect to all the functionalities of PermaplanT

## Resulting Tasks:

- Nursultan:
  - DB Design
  - feasibility study
    - undo in DB
    - canvas zoom
    - what coordinates we have in the canvas? e.g. zoom-in
    - differences between databases
  - permapeople.org https://github.com/ElektraInitiative/PermaplanT/issues/102
  - reinsaat.at https://github.com/ElektraInitiative/PermaplanT/issues/123
- Ramzan:
  - guidelines
    - singular vs. plural
    - varchar vs. text
  - layers/alternatives/time support in DB (together with Nursultan)
  - continue researching/discovering PostGIS e.g. projection algorithms
- Moritz:
  - connect plants with seeds (together with Paul)
  - handover of scraper tasks
- Thorben:
  - create ER/SQL for users and maps tables (coordinate with Samuel)
- Benjamin:
  - continue investigation in polyculture task
