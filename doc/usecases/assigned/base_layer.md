# Use Case: Base Layer

## Summary

- **Scope:** Base Layer
- **Level:** User Goal
- **Actors:** App User
- **Brief:** User imports a picture to use as a background.
- **Assignee:** Moritz

## Scenarios

- **Precondition:**
  - User has opened the app and selected the base layer.
  - The user has an orthophoto or site plan and knows the real length of a flat part of the orthophoto (e.g. length of house's roof).
- **Main success scenario:**
  - User successfully imports an orthophoto or site plan to be used as a background by selecting the option to
    - import a picture to Nextcloud or
    - by choosing an image from Nextcloud.
  - The user draws a polygon telling the app where the borders of this image are (these boarders are stored in the map and not subjective to "alternatives").
  - Georeferencing (of polygon): The user tells real lengths of lines (on flat land) so that we know how big this image in reality is (see use case "measuring distance").
  - The user chooses an orientation of the picture, i.e., rotate the image to where north is.
  - The user chooses where north related to the screen is by rotating an north arrow (this rotates the image and the polygon together).
- **Alternative scenarios:**
  1. User selects an (additional) alternative image.
     - The user scales the image, so that it fits to prior georeferencing.
     - The user chooses an orientation of the picture, i.e., rotate the image to where north already is to fit prior north orientation
     - The user can switch back to the original image.
  2. User accidentally replaces the ortophoto with another image or wrongly put a line in the polygon and presses undo to correct the mistake.
  3. The user later (after changes in other layers were already done) finds that the polygon, the orientation or the georeferencing contains a problem:
     - The app automatically saves the current version of the map.
     - The user corrects the polygon, the orientation or the georeferencing.
     - The database gets rewritten with the new geometric data.
       (No undo available but the user can load the previous version.)
- **Error scenario:**
  - User attempts to import a file that is not a supported image format or is corrupted and the app displays an error message.
    The user is prompted to choose a correct image in one of the supported formats instead.
  - The orders polygon(s) do not close: the app displays an error message.
    The user is prompted to close the polygon(s).
- **Postcondition:** The user's selected background image and borders are used for further planning.
- **Non-functional Constraints:**
  - Support for multiple image formats
  - Supports alternatives, see Alternative scenario 1 (but alternatives is **not supported** for border polygon/georeferencing and Alternative scenario 3.)
  - Support for undo for most changes but not for Alternative scenario 3.
