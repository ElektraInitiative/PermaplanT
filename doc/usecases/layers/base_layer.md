# Use Case: Base Layer

## Summary

- **Scope:** Base Layer
- **Level:** User Goal
- **Actors:** App User
- **Brief:** User imports a picture to use as a background.
- **Status:** Assigned
- **Assignee:** Moritz

## Scenarios

- **Precondition:**
  - User has opened the app and selected the base layer.
  - The user has an orthophoto or site plan and knows the real length of a flat part of the orthophoto (e.g. length of house's roof).
- **Main success scenario:**
  - User successfully imports an orthophoto or site plan to be used as a background by selecting the option to import a picture.
  - Then the user chooses the desired image from their device or by providing an image URL.
  - The user draws a polygon telling us where the borders of this image are.
  - The user tells the real length of a line (on flat land) so that we know how big this image in reality is (see use case "measuring distance").
  - The user chooses an orientation of the picture, i.e., rotate the image to where north is.
  - The user chooses where north related to the screen is by rotating an north arrow (this rotates the image and the polygon together).
- **Alternative scenario:** User accidentally selects the wrong image and selects another image to correct the mistake.
- **Error scenario:**
  - User attempts to import a file that is not a supported image format or is corrupted and the app displays an error message.
  - Borders do not close: the app displays an error message.
- **Postcondition:** The user's selected background image and borders are used for further planning.
- **Non-functional Constraints:**
  - Support for multiple image formats
  - Supports alternatives (use of different pictures)
