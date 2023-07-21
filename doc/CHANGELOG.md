# Changelog

All notable changes for developers or end users will be documented in this file.

Use a not-yet-used-in-any-PR random line in the top-most version.

Syntax: `- short text describing the change _(Your Name)_`

## 0.3.0 - UNRELEASED

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
- squashed migrations _(temmey)_
- commented out properties in table plants for now to improve build time. _(temmey)_
- set all enums in DB to lowercase _(temmey)_
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
- _()_
- _()_
- _()_
- _()_
- _()_
- _()_
- _()_
- _()_
- CI: Improve pipeleine parallelization #577 _(4ydan)_
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
- Nextcloud image gallery including Nextcloud image components for unauthenticated and authenticated use, Nextcloud utilites for fetching data from Nextcloud public share _(Samuel)_
- most of discussed UI/UX improvements done: disabled icons, tooltips for buttons in left bar, tooltips for plants, images for plants, notification border color, select one plant of selection for attribute editor (needs some polishing still) _(Paul and Samuel)_
- Fetch corresponding layer IDs of a map during initialization of the map editor _(Paul and Thorben)_
- Use the correct layer ID for create and fetch actions (for plantings) in the map editor, enabling the possibility for multiple independent maps _(Paul and Thorben)_
- Location picker map in map creation form only loads after actively pressing a button _(Thorben)_
- Maps can be duplicated from the map overview (in PR #515) _(Thorben)_

## 0.1.0 - 19.04.2023

- Created Landingpage _(PermaplanTeam)_
