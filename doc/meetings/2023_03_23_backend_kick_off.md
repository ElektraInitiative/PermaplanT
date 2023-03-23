# Meeting 2023-03-23 Backend Kick-Off

_Protocolled by: Nursultan_

## Attendees:

-   Gabriel
-   Nursultan
-   Benjamin
-   Ramzan
-   (everyone on the mailing list is welcomed)

## Agenda:

-   welcome ☺️
-   architecture:
    -   quality goals:
        1. stability
        2. maintenance
        3. performance
        4. privacy
    -   which modules do we have?
    -   where to add which code, e.g.:
        -   polyculture algorithms -> subfolder services
        -   switching of layer/time -> parameters to endpoint
        -   session handling -> nextcloud (OAuth client lib), token only in browser, not in backend or DB, open decision: best Rust OAuth Client (https://auth0.com/blog/build-an-api-in-rust-with-jwt-authentication-using-actix-web/)
        -   transaction handling -> dont need
        -   threading -> tokio
        -   regular tasks (see decision below) -> cronjob
        -   validation -> done by diesel
        -   reporting/monitoring (Nursultan haven't found the mentioned tool)
        -   ?
    -   solution strategy?
       - types
       - diesel/rust intro in docs(Gabriel)
    -   can we be stateless?
- documentation:
    1. mdBook (general intro)
    2. API documentation (swagger?)
    3. code documentation of backend
    4. code documentation of frontend
-   APIs:
    -   to DB -> Diesel must be learned
    -   to Frontend
-   which decisions do we need to make?
    -   API documentation
        -   https://github.com/ElektraInitiative/PermaplanT/pull/101
        - typescript generation of openapi?
    -   DB documentation
        -   https://github.com/ElektraInitiative/PermaplanT/issues/97 -> yes, we document the structs
        -   what about SQL queries?
        - open decision: best Rust OAuth Client/Server
    -   regular tasks https://github.com/ElektraInitiative/PermaplanT/pull/130
-   which tasks do we have?
    -   logging decision
    -   extend pre-commit hook for backend (Benjamin)
    -   cargo watch (Gabriel)
-   who wants to work on which task?
   - Gabriel: mdBook, API docu
   - Benjamin: pre-commit hook, review mdBook, API frontend
   - Nursultan: documenting structs
   - Ramzan: Diesel Postgis, check how to document algorithm
