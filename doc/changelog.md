# Changelog

All notable changes for developers or end users will be documented in this file.

Use a not-yet-used-in-any-PR random line in the top-most version.

Syntax: `- short text describing the change _(Your Name)_`

## 0.3.7 - UNRELEASED

- _()_
- _()_
- Refactor react query error handling _(Daniel Steinkogler)_
- _()_
- Fix seed routes and add naming convention guideline _(Daniel Steinkogler)_
- Enable automatic image scaling in base layer _(Moritz)_
- _()_
- Add [guideline](guidelines/frontend-keyhandling.md) and [decisions](decisions/frontend_keyhandling.md) for key handling) _(Daniel Steinkogler)_
- _()_
- _()_
- _()_
- _()_
- _()_
- _()_
- Added Meeting Agenda&Notes for 20.10. 9:00 _(Markus Raab, Samuel)_
- Added Meeting Agenda&Notes for 27.10. 9:00 _(Markus Raab, Jannis)_
- _()_
- _()_
- _()_
- _()_
- _()_
- _()_
- Remove error messages in console if a seed wsa not foud _(Moritz)_
- _()_
- _()_
- _()_
- _()_
- _()_
- _()_
- _()_
- _()_
- _()_
- Enable deletion of selected plants via DEL shortcut _(Daniel Steinkogler)_
- _()_
- _()_
- _()_
- _()_
- _()_
- _()_
- _()_
- _()_
- _()_
- _()_
- Increased zoom scaling factor for Map Editor / faster zooming _(Samuel)_
- _()_
- _()_
- _()_
- _()_
- _()_
- _()_
- _()_
- _()_
- _()_
- _()_
- _()_
- _()_
- _()_
- _()_
- _()_
- Up the rust version to 1.74 _(4ydan)_
- _()_
- _()_
- _()_
- _()_
- _()_
- _()_
- _()_
- _()_

## 0.3.6 - 21.11.2023 (151 commits)

- Add [guideline](guidelines/frontend-keyhandling.md) and [decisions](decisions/frontend_keyhandling.md) for key handling) _(Daniel Steinkogler)_
- Plantings now store seed information if they were created using a seed _(Moritz)_
- Tooltips show the full plant for plantings that were created using a seed _(Moritz)_
- Refactor base layer toolbar using react hook form _(Moritz)_
- fixed: slider displays wrong value after toolbar resize _(Samuel)_
- Added Meeting Agenda&Notes for 13.11. 9:00 _(Markus Raab, Adi)_
- Hamburger menu opens a full page navigation on small viewports _(Samuel)_
- Fix regression where Full plant names are not shown _(Moritz)_
- CI: disable E2E tests in master #1055 _(4ydan)_
- Close modals with escape #1027 _(Daniel Steinkogler)_
- Display the plant icon next to the cursor in placement mode _(Samuel)_
- Plant layer is selected per default _(Samuel)_
- E2E: Increase e2e timeline/baselayer test stability, replace timeouts with sleep #1010 _(4ydan)_
- Release: npm audit fix #1077 _(4ydan)_

## 0.3.5 - 06.11.2023 (320 commits)

- Calculation of scaling now fixed, please (auto)scale your map again.
- Fix similar toasts appearing multiple times on screen _(Moritz)_
- Fix browser browserlists #954 _(4ydan)_
- Decide about which use cases to include for 1.0 _(Markus Raab and Yvonne Markl with the help of PermaplanTeam)_
- Enable automatic image scaling in base layer _(Moritz)_
- Add concept for key handling _(Daniel Steinkogler)_
- Refactor keybindings according to new keybinding concept _(Daniel Steinkogler)_
- Plantings now store seed information if they were created using a seed _(Moritz)_
- Tooltips show the full plant for plantings that were created using a seed _(Moritz)_
- Decide about which use cases to include for 1.0 _(Markus Raab and Yvonne Markl with the help of PermaplanTeam)_
- Plantings now store seed information if they were created using a seed _(Moritz)_
- Tooltips show the full plant for plantings that were created using a seed _(Moritz)_
- Enable seed search in plant layer _(Moritz)_
- Finish seed use case _(Moritz)_
- Add decision for api mocking tool _(Daniel Steinkogler)_
- Rename section "Seeds" to "Inventory" _(Moritz)_
- Added Meeting Agenda&Notes for 23.10. 9:00 _(Markus Raab, Daniel Steinkogler)_
- Added Meeting Agenda&Notes for 30.10. 9:00 _(Markus Raab, Christoph N.)_
- add decision for timeline concept _(Daniel Steinkogler)_
- Improve UI and responsiveness of file selector #1011 _(tschawax)_
- Add frontend UI and usability guide #918 _(tschawax)_
- Improve wordings, usability and UI of guided tour #871 _(tschawax)_
- Fix tour-completion logic of cancel-confirmation dialog in guided tour #986 _(tschawax)_
- Improve styling of login and logout button #983 _(tschawax)_
- Add horizontal scrolling to toolbars #981 _(tschawax)_
- Improve vertical scrollbar behaviour #970 _(tschawax)_
- Split and rewrite copy & paste usecase #1 _(tschawax)_
- Create remember-viewing-state usecase #1 _(tschawax)_
- Create multi-select usecase #1 _(tschawax)_
- Fix transformer rotation handle and moving selected plants #1013 _(tschawax)_
- Clean up the asset file structure in frontend _(Moritz)_
- Implement multi-select usecase #727 _(tschawax)_
- Fix plant deletion in guided tour on small screens #861 _(tschawax)_
- Enable ctrl, shift, command to modify selection #979 _(tschawax)_
- Fix tooltips on plant hovering in multi selection #1033 _(tschawax)_
- Add status-specific toolbox icon design and add toolbox icon support to icon button component #1025 _(tschawax)_
- Improve design and behavior of undo/redo icons and improve focus design #657 _(tschawax)_
- Added Meeting Agenda&Notes for 06.11. 9:00 _(Markus Raab, Moritz)_
- Added Meeting Agenda&Notes for 23.10. 9:00 _(Markus Raab, Daniel Steinkogler)_
- Added Meeting Agenda&Notes for 30.10. 9:00 _(Markus Raab, Christoph N.)_
- Enable planting a field of a plant #1039 _(tschawax)_
- Add status-specific toolbox icon design and add toolbox icon support to icon button component #1025 _(tschawax)_
- Improve design and behavior of undo/redo icons and improve focus design #657 _(tschawax)_
- Replace notes field in create seed form with markdown editor _(Daniel Steinkogler)_
- Improve dark mode design of danger variant buttons #1029 _(tschawax)_
- Improve loading spinner size in file selector and improve file selector responsiveness #1026 _(tschawax)_
- Improve tooltip wordings of toolbox icons and extract them into new single file #1028 _(tschawax)_
- E2E: Refactor data-testid according to naming convention _(4ydan)_
- pump versions _(4ydan)_
- CI: Run e2e tests on dev.permaplant _(4ydan)_

## 0.3.4 - 14.10.2023 (203 commits)

- Exit planting mode with escape _(Daniel Steinkogler)_
- Renaming of layer list components _(Daniel Steinkogler)_
- Fix ordering of seeds by expiration date _(Moritz)_
- Re-enable seed search. It will now take the entire plant name into account. _(Moritz)_
- Make plant names in select menu more consistent with seed overview _(Moritz)_
- Doc: refinement of timeline use cases _(Daniel Steinkogler)_
- Rectify order of name parts in plant names _(Moritz)_
- Added Meeting Agenda&Notes for 18.9. 9:00 _(Markus Raab, 4ydan)_
- Added Meeting Agenda&Notes for 25.9. 9:00 _(Markus Raab, Moritz)_
- Added Meeting Agenda&Notes for 2.10. 9:00 _(Markus Raab, Daniel)_
- Added Meeting Agenda&Notes for 9.10. 9:00 _(Markus Raab, Christoph)_
- Update seed use case _(Moritz)_
- Implement central facilities for displaying plant names _(Moritz)_
- Make sure that two seeds can't have the same combination of user, name and plant _(Moritz)_
- Restrict seed names to make complete names less confusing _(Moritz)_
- Fix "harvest year" column title wrapping inappropriately _(Moritz)_
- Make resetting in search input component cross-browser compatible and adapt resetting of search results #761 _(tschawax)_
- Update Zustand documentation #957 _(tschawax)_
- Fix dead end of step 8 of plants layer in guided tour #955 _(tschawax)_
- Doc: Reduce e2e entry barriers #917 _(4ydan)_
- Fix textarea not allowing more than one line of text _(Moritz)_
- E2E: Increase click on canvas robustness _(4ydan)_
- Fix cargo deny check _(4ydan)_
- Fix: release pipeline mdbook build stage _(4ydan)_
- Improve Makefile #681 _(4ydan)_
- CI: Tag docker images #931 _(4ydan)_

## 0.3.3 - 15.09.2023 (536 commits)

- Archive seeds instead of deleting them (with undo) #872 _(Moritz)_
- Expand seed overview with additional table fields _(Moritz)_
- Updated UC for guided tour and gaining blossoms _(Thorben)_
- Added a cancel confirmation to the editor tour _(Thorben)_
- Finish documentation of custom UI elements _(Moritz)_
- Fix seeds being set to Indian Abelia after edit _(Moritz)_
- Order seeds by use by and harvest year _(Moritz)_
- Add toggleable plant labels _(Moritz)_
- Fix various validation bugs in seed form _(Moritz)_
- Link seeds page in the navbar _(Moritz)_
- Disable seed search _(Moritz)_
- Enable seeds to be edited and deleted _(Giancarlo & Moritz)_
- Update UC for timeline and plants layer _(Paul)_
- Fix bug in updating of the plant selection _(Paul)_
- Added Meeting Agenda for 28.8. 9:00 _(Markus Raab)_
- Added Meeting Agenda for 4.9. 9:00 _(Markus Raab)_
- Added Meeting Agenda for 11.9. 9:00 _(Markus Raab)_
- update `doc/database/hierarchy.md` to clarify how we render plant names _(temmey)_
- updated sqlfluff config, remove unused .sql files _(temmey)_
- Add Christoph Nemeth as Teammember _(tschawax)_
- Fix middle mouse button to only move the stage or select individual plants #817 _(tschawax)_
- Fix selections being kept after choosing a plant from the search list #787 _(tschawax)_
- Fix placing new plants onto existing plants #890 _(tschawax)_
- Fix select box while being in placement mode #886 _(tschawax)_
- Fix selecting invisible plants #805 _(tschawax)_
- Seeds: translate quality and quantity columns _(Moritz)_
- Fix drag select not working and add appropriate e2e regression tests #852 _(4ydan & Moritz)_
- CI: Update doc _(4ydan)_
- Doc: Update testing strategy #864 _(4ydan)_
- E2E: Add new e2e test for undoing deletions #889 _(4ydan)_
- E2E: Seeds tests _(4ydan)_
- CI: Add changelog test to CI, only in PR stages #857 _(4ydan)_
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
- Login use case done. _(Gabriel and Samuel)_
- Layers visibility use case done. _(Samuel)_

## 0.1.0 - 19.04.2023

- Created Landingpage _(PermaplanTeam)_
