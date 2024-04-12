# Security

- Authentication must happen in keycloak
  - Decides who is member (only then you can create/edit any map)
  - Also used for discovering users
- Security of data must happen in the backend or in Nextcloud (for files)
- Any modifications of elements or maps must be marked by:
  - creation time (granularity in seconds)
  - creation id (person who created)
  - modification time (granularity in seconds)
  - modification id (person who modified)
- Only owners or collaborators are allowed to manipulate maps
