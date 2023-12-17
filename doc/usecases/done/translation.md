# Use Case: Translation

## Summary

- **Scope:** Translation
- **Level:** User Goal
- **Actors:** App User
- **Brief:** The user can choose the app's interface to be in English or German.
- **Status:** Done
- **Assignee:** Paul

## Scenarios

- **Precondition:**
  The user has opened the app and wants to change the language of the interface.
- **Main success scenario:**
  The user successfully translates the app's interface and text into English or German by selecting the desired language from the app's menu.
  By default, the app's interface language will be set to the user's browser language.
  If the language is neither English or German, the app's interface will default to English.
- **Alternative scenario:**
  The user accidentally selects the wrong language and uses the app's translation function to correct the mistake.
- **Error scenario:**
  User attempts to translate the app's interface and text but the app is experiencing technical difficulties and is unable to complete the request, displaying an error message.
- **Postcondition:**
  The app's interface and text are displayed in the selected language.
- **Non-functional Constraints:**

## Developers

Read [doc/guidelines/i18n.md](../../guidelines/i18n.md) for further information.
