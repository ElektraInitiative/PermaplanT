# Changelog

All notable changes for developers or end users will be documented in this file.

Use a not-yet-used-in-any-PR random line in the top-most version.

Syntax: `- short text describing the change _(Your Name)_`

## 0.3.3 - UNRELEASED

- _()_
- _()_
- Updated UC for guided tour and gaining blossoms _(Thorben)_
- _()_
- _()_
- _()_
- _()_
- Added a cancel confirmation to the editor tour _(Thorben)_
- _()_
- _()_
- _()_
- Finish documentation of custom UI elements _(Moritz)_
- _()_
- _()_
- _()_
- _()_
- _()_
- _()_
- _()_
- Add toggleable plant labels _(Moritz)_
- _()_
- _()_
- _()_
- _()_
- Link seeds page in the navbar _(Moritz)_
- _()_
- _()_
- _()_
- _()_
- Update UC for timeline and plants layer _(Paul)_
- _()_
- _()_
- _()_
- Added Meeting Agenda for 28.8. 9:00 _(Markus Raab)_
- _()_
- _()_
- update `doc/database/hierarchy.md` to clarify how we render plant names _(temmey)_
- updated sqlfluff config, remove unused .sql files _(temmey)_
- _()_
- _()_
- _()_
- _()_
- _()_
- _()_
- _()_
- _()_
- Add Christoph Nemeth as Teammember _(tschawax)_
- _()_
- _()_
- _()_
- _()_
- _()_
- _()_
- _()_
- _()_
- CI: Add changelog test to CI #857 _(4ydan)_
- E2E: Worker uuids fixture #837 _(4ydan)_
- GIT: Add data analysis jupyter notebook #843 _(4ydan)_
- MDB: Fold all chapters #818 _(4ydan)_
- CI: Add codespell pre-commit #811 _(4ydan)_
- E2E: Add base layer tests #777 _(4ydan)_
- E2E: Add timeline tests #796 _(4ydan)_
- E2E: Add layer visibility tests #797 _(4ydan)_

## 0.3.2 - 07.08.2023 (42 commits)

- Fix a bug where an 'empty' but visible selection box would be left behind _(Paul)_
- Fix a bug where seemingly random date change actions would be fired _(Paul)_
- Fix dimensions of canvas _(Paul)_
- npm audit fix + test protocol _(Markus)_
- E2E: Add undo/redo e2e tests # _(4ydan)_
- E2E: Improve documentation/usage #784 _(4ydan)_

## 0.3.1 - 03.08.2023 (54 commits)

- Added a cancel confirmation to the editor tour _(Thorben)_
- Disabled retry on Nextcloud plant icons in PlantSearch _(Samuel)_
- Commented out disabled buttons for user study _(Samuel)_
- Basic baseLayerConfig validation - fixed bugfix/734-base-layer-image-gets-lost _(Samuel)_
- Fix a bug where texts in the editor tour were swapped _(Thorben)_
- Map: Remove Step/History info #745 _(4ydan)_
- E2E: Add planting e2e tests #766 _(4ydan)_
- E2E: Add plant search e2e tests #751 _(4ydan)_
- CI: Add most of pre-commit hooks to sanity stage #736 _(4ydan)_

## 0.3.0 - 28.07.2023 (273 commits)

- Added Guided Tour for the Map Editor _(Thorben)_
- Remove error toast when adding a plant without an icon in Nextcloud. _(Moritz)_
- commented out properties in table plants for now to improve build time. _(temmey)_
- set all enums in DB to lowercase _(temmey)_
- added component to display plant names correctly formatted _(temmey)_
- fixed issues with correctly displaying plant names _(temmey)_
- Add grid functionality. _(Moritz)_
- sizes of plant in map editor depend on their spread value _(temmey)_
- Handle events of same user, discard events in same tab _(Paul)_
- Fix a bug in the date handling actions of plants _(Paul)_
- updated scraper to translate spread&height into new enum types _(temmey)_
- Add debouncing to base layer toolbar _(Moritz)_
- Fix a bug in loading images _(Paul)_
- Fix a bug where the wrong value is assigned to an input field _(Moritz)_
- Give feedback when plant search is empty _(Moritz)_
- Display icon in plant search if available. _(Moritz)_
- DEV: squashed migrations _(temmey)_
- DEV: start using sqlfluff in pre-commit _(temmey)_ and Benjamin
- CI: Improve pipeline parallelization #577 _(4ydan)_
- CI: Add groovy pre-commit hook #685 _(4ydan)_
- CI: Optimized mdbook docker image #585 _(4ydan)_
- CI: Test `diesel` migrations in PR and master #134 _(4ydan)_
- CI: Remove cargo check, put clippy before doc #688 _(4ydan)_
- E2E: login/logout e2e tests #625 _(4ydan)_
- E2E: map creation e2e tests #707 _(4ydan)_

## 0.2.3 - 18.07.2023 (165 commits)

- integrated FileSelector in BaseLayer _(Samuel)_
- introduced file selection components to select and upload Nextcloud files _(Samuel)_
- Finish implementation of seed search _(Moritz)_
- A timeline date can be set and changed by a date picker. Plantings exist relative to a date. _(Paul)_
- The add/remove date of plants can be changed in the toolbar. _(Paul)_
- Added `zod` as form validation library. _(Paul)_
- Finish implementation of seed search _(Moritz)_
- CI: Check package-lock.json #597 _(4ydan)_
- Further Makefile targets #630 _(4ydan)_
- DOC: Improve manual test case docu _(4ydan)_
- CI: mdbook linkchecker policy set to error #628 _(4ydan)_
- Up webdav to 5.2.2 and vite to 3.2.7 due to security issues #629 _(4ydan)_
- backend: add endpoint to generate the heatmap _(Gabriel)_
- UX: Revised existing error notifications and added new ones for other API calls _(Thorben)_
- backend: add scheduled task to remove maps #90 _(GabrielThorben)_

## 0.2.2 - 12.07.2023 (282 commits)

- Added Nextcloud integration documentation in `/doc/research/nextcloud_integration.md`_(Samuel)_
- Fix wrong placement of plantings _(Paul)_
- CI: Send email when master fails #109 _(4ydan)_
- CI: Add link checker to CI pipeline #555 _(4ydan)_
- Fix bug in relations _(Paul)_
- UI: Added hover tooltip to edit map button _(Thorben)_
- UX: Revised existing error notifications and added new ones for other API calls _(Thorben)_
- Remove anchors to prevent nonuniform scaling of elements _(Paul)_
- CI: Cancel previous builds #557 _(4ydan)_
- CI: Parallel stage: fail fast & timeout & deleteDir #591 _(4ydan)_
- Display version number on the navbar and move github link #574 _(4ydan)_
- Improved user visible texts in map editor _(Thorben)_
- DEV: Makefile added #549 _(4ydan)_
- added plant relations import script to scraper _(temmey)_
- added Christoph Kraus as Teammember _(temmey)_

## 0.2.1 - UNRELEASED (1024 commits)

- Test strategy written _(4ydan)_
- CI: Storybook/Typedoc build and stashed in Jenkins pipeline PR/Master/Release #438 _(4ydan)_
- DOC: Fix broken links #554 _(4ydan)_
- CI: Devcontainer support #552 _(4ydan)_
- CI: Added mdbook build to pipeline _(4ydan)_
- DEV: Small devcontainer improvements #563 _(4ydan)_
- DEV: Issue forms added. #537 _(4ydan)_

## 0.2.0 - 29.06.2023

- Nextcloud Konva image component: can be used to create image items on a layer _(Samuel)_
- Nextcloud image gallery including Nextcloud image components for unauthenticated and authenticated use, Nextcloud utilities for fetching data from Nextcloud public share _(Samuel)_
- most of discussed UI/UX improvements done: disabled icons, tooltips for buttons in left bar, tooltips for plants, images for plants, notification border color, select one plant of selection for attribute editor (needs some polishing still) _(Paul and Samuel)_
- Fetch corresponding layer IDs of a map during initialization of the map editor _(Paul and Thorben)_
- Use the correct layer ID for create and fetch actions (for plantings) in the map editor, enabling the possibility for multiple independent maps _(Paul and Thorben)_
- Location picker map in map creation form only loads after actively pressing a button _(Thorben)_
- Maps can be duplicated from the map overview (in PR #515) _(Thorben)_

## 0.1.0 - 19.04.2023

- Created Landingpage _(PermaplanTeam)_
