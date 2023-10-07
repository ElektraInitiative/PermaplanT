# Use Case: Map Timeline Single Selection

## Summary

- **Scope:** Map View
- **Level:** User Goal
- **Actors:** App User
- **Brief:** The user can view the map at different points in time by using the timeline feature.
- **Assignee:** Daniel Steinkogler

## Scenarios

- **Precondition:**
  - The user has opened the app and selected a map.
  - The timeline shows the current date.
- **Main success scenario:**
  - A timeline is presented to the user witch allows them to select year, month and day.
  - Year, month and day can be individually selected by scrolling or moving sliders.
  - This allows navigation to a different point in the past, present and future.
  - The map updates to show the state of the garden at the selected point in time (removing or adding elements accordingly).
  - Adding or removing elements is done on the selected date.
  - The selected date is highlighted in bold.
  - The sliders are synchronized (e.g. if the user scrolls the day slider over the last day of the month, the month slider is updated to the next month)
- **Alternative scenario:**
  - The user corrects the dates in the attributes of elements or presses undo to undo changes in the dates.
- **Error scenario:**
- **Postcondition:**
  The user has successfully changed to the desired date.
- **Non-functional Constraints:**
  - Performance: data in up to 100 years should be fast to use
- **Note:**
  - Single Date Selection must always be an exact date so we have a well-known date (reference point) when elements got added to the map.

## Development Progress

- Changing the map's date is currently implemented with a simple date picker in [Timeline.tsx and sub-components](https://github.com/ElektraInitiative/PermaplanT/blob/9927a132de09377baad47237f3048939f84c568b/frontend/src/features/map_planning/components/timeline/Timeline.tsx).  
  The related logic in the MapStore can be found [here](https://github.com/ElektraInitiative/PermaplanT/blob/9927a132de09377baad47237f3048939f84c568b/frontend/src/features/map_planning/store/UntrackedMapStore.ts#L177)
- the new version of the timeline should allow user to select date by scrolling or moving sliders
