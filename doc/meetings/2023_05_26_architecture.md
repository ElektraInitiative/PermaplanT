# Meeting 2023-05-26 Architecture

## Participants

- Paul
- Thorben
- Moritz
- Samuel
- Lukas (Zuhörer)

## Questions

The main architectural questions are:

- current state? (layers state+backend)
  - array, actions
- lock
- When to submit data to the backend?
- multi-player?
- SSE
- How to send data to the backend?
  - array von actions
- How to get updates from the changes of other users?
- Scope of versions, undo/redo
  - tracked/untracked history
- how separated are layers
- Collaborative vs. Offline
- Locking of layers
- undo/redo
- removing versions?
- timeline (createdAt, deletedAt) -> many year span not considered yet
- actions associated with layer
- map owner can remove locks
- without lock offline: read-only state

- lösung:

  - backend always up-to-date
  - collaborativ: see what others are doing
  - only conflicts in most recent actions
  - undo/redo history gets purged on movement
  - lazy loading of layers (not years)
  - we need reverse actions
  - separated from it then IS-state (not initial)
  - begin, end date different to delete!
  - coordinates: konva coordinate CSS pixel = 1cm
  - objects: x,y,scale,color, shape, ID, rotation
  - per layer API calls
  - plant API calls:
    1. search (text) -> list of plants
    2. plant_info () -> info, list plant_ID of relations, array of 1m raster, maybe picture/heat map
    3. place_plant (plant_ID, pos, date)
  - map versions löschen

  - remember which objects are loaded?

  - elemente in DB store

outcome:

- moritz: auth, image, pixels docu
- paul: lazy loading, state management
- samuel: NC, state
- Thorben: remove versioning, map duplication

We would then have to keep track of the undo/redo history for each user on the backend as well. -> we don't do
The read-only users should only have the latest version of the data + their local changes in the history.
Without keeping track of the undo/redo history on the backend, sending a new version to the backend at a fast pace would clutter it.

Please also read (with my comments):
https://github.com/ElektraInitiative/PermaplanT/pull/382/files

## Meeting Notes

- Undo/Redo
- Current plan:
  - base state + actions taken until now
  - synchronize with backend via version creation, backend takes actions and builds new base state
  - proposition: save actions in backend to restore lost sessions
  - could cause synchronization problems with offline functionality
  - implement locks on layers to reduce synchronization conflicts
  - problem: what happens if user loses lock while offline and then comes online again
  - "multiplayer" szenario: every user tracks only their own history
  - how does undo/redo interact with very old changes (e.g. 10 years ago)
  - do not load every data, only when needed (lazy loading)
  - remove local history of one layer if another user made changes on it
- new plan:

  - directly push changes to backend
  - every layer has its own endpoints
  - history holds undo actions

- Frontend map store

  - tracked and untracked states
  - tracked: affected by undo/redo
  - untracked: configurations (e.g. layer opacity)
  - layer independent store => to be used by all layers

- Backend interaction with offline use case

  - lock backend writes on map when going offline
  - offline capability as a grantable permission for collaboration
  - map owner should be able to revoke write lock in case of an abuse of offline mode
  - as a first step no write lock, instead read only when offline

- Save creation and disable dates for every element, "deleting" a plant sets it disabled to still be able to view it in the timeline
- Position of elements will not be saved for the timeline and instead gets overwritten with every coordinate change
