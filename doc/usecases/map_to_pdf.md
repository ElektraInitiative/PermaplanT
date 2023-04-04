# Use Case: Generate Printable Map PDF

## Summary

- **Scope:** Map View
- **Level:** User Goal
- **Actors:** App User
- **Brief:** Users can generate a PDF file containing a screenshot of their current map view with a header/footer displaying relevant metadata, such as current time, map timestamp, GPS coordinates, and scale.
- **Status:** Draft
- **Assignee:** Ramzan

## Scenarios

- **Precondition:**
 - The user has opened the app and navigated to the desired map view.
- **Main success scenario:**
 - The app captures a screenshot of the current map view and generates a PDF file.
 - The app adds a header/footer to the PDF containing the current time, map timestamp, GPS coordinates, and scale.
 - The user receives the generated PDF file for printing or saving.
- **Alternative scenario:**
 - The user selects custom options e.g. for the header/footer, such as changing the format or choosing which metadata to include.
- **Error scenario:**
 - The app encounters an issue while generating the PDF file, such as insufficient storage space or an unexpected error.
- **Postconition:**
 - The user has successfully generated a printable PDF file containing the current map view and relevant metadata in the header/footer.
- **Non-functional Contstrains:**
 - The generated PDF should be compatible with common PDF readers and printers.
 - The option to generate a printable map should be easily accessible and understandable.
