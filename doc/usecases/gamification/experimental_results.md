# Use Case: Result Feedback

## Summary

- **Scope:** Experimental Results
- **Level:** User Goal
- **Actors:** App User
- **Brief:** The user can give a feedback to the actual results of the map in a measuring cycle.
- **Status:** Draft

## Scenarios

- **Precondition:**
  - The user has opened the app.
  - The user has previously fully designed a map and implemented it in real life.
- **Main success scenario:**
  - The user gets a number of simple recommended methods to analyze plant physiology or soil attributes (e.g. pH value), including a step-to-step guide to execute them.
  - The user performs one or more of these methods or conducts their own advanced analysis.
  - The user can input the results of the analysis in a feedback form of the map.
  - The data gets saved and is used to adapt the parameters of the used entities in this map.
- **Alternative scenario:**
- **Error scenario:**
  A technical error occurs, preventing the user from submitting the feedback form. In this case the system should display an error message and allow the user to try again.
- **Postcondition:**
  The accumulated data from this and previous measuring cycles can be viewed as a report in a seperate details screen of the map and to some extend in the corresponding layers (e.g. pH value in [soil layer](../layers/soil_layer.md)).
- **Non-functional Constraints:**
