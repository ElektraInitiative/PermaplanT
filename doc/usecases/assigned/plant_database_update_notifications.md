# Use Case: Plant Database Update Notification

## Summary

- **Scope:** Notifications & Plant Management
- **Level:** User Goal
- **Actors:** App User
- **Brief:** Notify users about updates of the plant database.
- **Assignee:** Andrei (Frontend), Jannis (Backend)

## Scenarios

- **Precondition:**
- The user has opened the app and has successfully logged in.
- The plant database has been updated since the user's last login.
- **Main success scenario:**
- Upon login, the user receives a notification about the updated plant database if affected plants exist on the map or in the favorites and if:
- light, water or soil requirements changed
- edible status changed
- warning was added (in plant database), e.g. "weed potential"
- dates of sowing or raising changed
- companions changed
- The notification highlights plants that have changed.
- The user adjusts their garden layout accordingly.
- The user confirms that the updates were considered and goes back to normal mode.
- **Alternative scenario:**
- The user dismisses the notification without reviewing the updated plant positioning recommendations. The notification is accessible later from a designated area in the app.
- The user decides to not receive updates of changed plants in the future.
- **Error scenario:**
- The app is unable to retrieve the updated plant database information due to connectivity issues or server problems.
- Data synchronization issues: In cases where an application needs to synchronize data across multiple devices or platforms, errors or inconsistencies might arise, leading to data loss or conflicts.
- **Postconition:**
- The user is aware of the updated plant database and can make informed decisions about their garden layout based on the latest recommendations.
- **Non-functional Contstrains:**
- The app should quickly retrieve and display plant database updates, providing a seamless user experience.
- The notification system and plant management interface should be intuitive and easy to use.
- The app should consistently inform users of plant database updates, ensuring that users are always aware of the latest recommendations.
