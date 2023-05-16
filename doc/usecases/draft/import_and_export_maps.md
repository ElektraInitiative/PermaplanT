# Use Case: Import and Export Maps

## Summary

- **Scope:** Map View
- **Level:** User Goal
- **Actors:** App User
- **Brief:** Users can import and export maps.

## Scenarios

- **Precondition:**
- The user has opened the app.
- The user is viewing the map interface.
- **Main success scenario:**
- The user exports the current map data in the app to a GIS map file upon which the app generates a GIS map file containing the map data, which can then be shared or used in other mapping applications.
  The state of the map before the import is still available as a previous version.
- The user imports a GIS map file by providing the required file.
  Once imported, the map data is displayed in the app's map view, allowing the user to interact with the imported map elements.
- **Alternative scenario:**
- The user imports a GIS map file that contains additional information that cannot be mapped to the database. The app provides a warning message because it will discard this information.
- **Error scenario:**
- In the case of errors, the original map stays unmodified:
- The user attempts to import an unsupported file format or a corrupted GIS map file.
- The user imports a large GIS map file that exceeds the app's size limit or takes too long to process.
- The user exports a GIS map file, but the app detects that the map contains incomplete or inconsistent data.
- **Postconition:**
- The user has successfully imported or exported a GIS map file, enabling him to work with the map data in the app or share it with others.
- **Non-functional Contstrains:**
- The import and export processes should be efficient and have minimal impact on the app's performance.
- The app should support common GIS map file formats for maximum interoperability with other mapping applications.
- The import and export options should be easily accessible and intuitive for users to understand and use.
