# Use Case: Reward Preview

## Summary

- **Scope:** Reward Preview
- **Level:** User Goal
- **Actors:** App User
- **Brief:** A user can see a preview of future rewards for his efforts.
- **Status:** Draft

## Scenarios

- **Precondition:**
  - The user has opened the app and is editing a map.
  - The user has planted at least one plan on his map.
- **Main success scenario:**
  - The app calculates the dates for receiving potential rewards of the existing plants, like e.g. the flowering time or harvesting periods of a certain plant.
  - The user can see a marker on the [map timeline](map_timeline.md) indicating those rewards.
  - When selecting a date or timeframe that includes such a reward, the icon of the respective plant(s) will change to include a bed of flowers for plants with 
    active flowering time and a harvest bucket for plants that yield harvest at that moment.
- **Alternative scenario:**
- **Error scenario:**
  - The app incorrectly displays a plant as having a reward or does not display a reward for a plant that should have one.
    In this case the user should reload the layer to let the system recalculate the conditions for displaying rewards.
- **Postcondition:**
  - The user has an overview over the possible rewards the map can yield in the future.
- **Non-functional Constraints:**
