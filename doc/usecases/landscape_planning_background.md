# Use Case: Importing a Background Image

## Summary

- **Scope:** Base Layer
- **Level:** User Goal
- **Actors:** App User
- **Brief:** User imports a picture to use as a background to copy borders, landscapes, trees etc
- **Status:** Draft

## Scenarios

- **Precondition:** User has opened the app and selected the base layer.
- **Main success scenario:**
  - User successfully imports a picture to use as a background by selecting the option to import a picture and choosing the desired image from their device or providing an image url.
  - User draw a polygon telling us where the borders of this image are OR scales the image to fit the already drawn borders.
  - User tells the real length of a line so that we know how big this image in reality is (related is the use case of measuring distances) OR scales the image.
  - User chooses an orientation of the picture, i.e., rotate the image to where north is.
- **Alternative scenario:** User accidentally selects the wrong image and selects another image to correct the mistake.
- **Error scenario:** 
  - User attempts to import a file that is not a supported image format or is corrupted and the app displays an error message.
  - Borders do not close: the app displays an error message.
- **Postcondition:** The user's selected background image and borders are used for further planning.
- **Non-functional Constraints:**
  - Support for multiple image formats
