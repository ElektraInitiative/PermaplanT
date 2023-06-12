# Runtime View

## Plantings

```mermaid
sequenceDiagram
    actor User
    User->>+Frontend: search for plant
    Frontend->>+Backend: search
    Backend->>-Frontend: list of plants
    User->>Frontend: selects plant
    Frontend->>+Backend: placements
    Backend->>-Frontend: list plant_ID of relations, heat map
    User->>Frontend: place plant
    Frontend->>Backend: place plant
```

- search via GET on /api/plants
- placements via GET on /api/maps/{map_id}/layers/plants/placements
- place plant via POST on /api/maps/{map_id}/layers/plants/plantings (plant_ID, pos, date)

## Onboarding

```mermaid
sequenceDiagram
    actor User

    User->>Permaplant: visit landing page

    User->>Keycloak: self-registration
    activate Keycloak


    User->>Permaplant: visit public maps
    activate Permaplant

    Permaplant->>Nextcloud: use images etc.
    activate Nextcloud
    actor Admin

    User->>Permaplant: membership application
    Permaplant->>Admin: notification

    alt accept
        Admin->>Keycloak: change role to member and ask for email verification
    else accept
        Admin->>Keycloak: ask for new membership application
    end

    activate Keycloak
    Admin->>Permaplant: remove sensitive data
    Admin->>Nextcloud: change quota
    Admin->>User: notification via email
    deactivate Keycloak
    deactivate Keycloak
    deactivate Permaplant
    deactivate Nextcloud
```

## Season

Example of a typical sequence in one season:

```mermaid
sequenceDiagram
    actor User
    User->>+App: input of available seeds
    User->>App: import base map
    User->>App: planning of landscape
    User->>App: planning of plants
    App->>-User: list of needed seeds
    User->World: get missing seeds
    User->>World: raise plants indoor (vorziehen)
    User->>App: set batch as raised

    World->>User: plants ready, weather ok
    loop
        App->>User: batch (of plants) should be planted
        User->>World: plant batch in garden
        activate World
        User->>+App: set batch as planted


    end

    User->World: harvest and remove plants
    deactivate World
    User->>App: set plants as harvested or removed
    World->>User: seeds for next year
```
