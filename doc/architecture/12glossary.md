# Glossary

## Basics

- PermaplanT:
  the planning app implemented in this repository
- map:
  The main planning utility for PermaplanT, which contains _elements_ in several _layers_.
- garden:
  The physical place which is represented by the map.
  Can also be balcony or similar.
- event:
  a day relevant to a user, which occurs on a map, e.g. when elements in the map get added/removed (accuracy: one day) or when a user declares a map ready for review etc.
- deletion/creation vs. removal/adding of elements
  - deletion/creation (German: löschen/erzeugen):
    The plant never existed.
    Such elements actually get deleted from the database and can only be restored within the session using undo.
    I.e. there are often columns named `created_date` but there usually is not a deletion date (with exception of maps which do not immediately get deleted).
  - removal/adding (German: entfernen/hinzufügen):
    Removal of elements assume that the element actually was on the map (physically) during some time (between adding and removing).
    The database must keep removed elements, they never can be deleted.

## Technical

- Nextcloud map:
  A Nextcloud app which is used as overview where which garden is, see [here](https://apps.nextcloud.com/apps/maps).
- GeoMap:
  The geographical map which is found in Nextcloud under the "Maps" tab.
- offline:
  Means the ability to use a feature without Internet connection, i.e., without calling REST APIs.
- canvas:
  The main and middle part of the screen which provides the planning/drawing functionality.
- elements (of a map in a layer):
  Can be drawn or added to the map via drag and drop.
  They have _attributes_.
- canvas context
  - canvas node elements i.e. HTML representation of rectangle, circle, etc. on the canvas
- map context:
  - layers and their attributes e.g. warning layer and its visibility
- reversible deletion vs undo-redo functionality:
  - reversible deletion: a database entity i.e. a whole map and plant is deleted and can be restored within a certain time
  - undo-redo functionality: a user can undo and redo changes in the map, but the history is local to the frontend and not stored in the database
- lazy loading:
  - Lazy loading refers to the process of loading data on-demand, rather than loading everything upfront during the initial load of the app.
- offloading of the frontend state:
  - the process of cleaning up the frontend state by deleting data that has already been synchronized with the backend and is no longer needed. This can help to reduce the amount of unnecessary data in the frontend, which can improve the performance and efficiency of the application.
- first contentful paint (FCP):
  - the time it takes for the browser to render the first bit of content on the page.
- time to interactive (TTI):
  - the time it takes for the page to become fully interactive.
- Document Object Model (DOM):
  - the data representation of the objects that comprise the structure and content of a document on the web.
- endpoints:
  - The API endpoints that can be called in the backend.  
    Their documentation can be viewed using swagger-ui (see [here](../backend/03api_documentation.md) for reference).

## Biology

- taxonomy:
  A scientific classification of plants into a hierarchy.
  The hierarchy we use is described [here](../database/hierarchy.md).
  As first introduction read:
  - [permakultur konkret](https://permakultur-konkret.ch/umsetzung-uebersicht/pflanzenkunde/systematik/) or
  - [wikipedia](https://en.wikipedia.org/wiki/Plant_taxonomy).
  - [Garten Treffpunkt](https://www.garten-treffpunkt.de/lexikon/botanik.aspx)
- rank:
  Rank is a level within taxonomy.
  Plants within one taxonomic rank share traits with each other.
  The levels relevant for PermaplanT are from highest to lowest:
  - Family
  - Genus
  - Species
  - Variety
  - Cultivar
- below:
  We say a plant or rank _B_ is _below_ another rank _A_ if it is at least one rank lower than _A_.
- belong:
  We say a plant _B_ is _belongs_ to rank _A_ if it is exactly rank _A_ (and not below).
- concrete plant:
  Is in an actually existing species, variety and cultivar.
- abstract plant:
  Representants of ranks, which are not actually existing plants.
- family:
  A taxonomic rank that consists of multiple genera.
- genus:
  A taxonomic rank which is part of a family.
  Consists of multiple species.
- species (German: Art):
  A taxonomic rank which is part of a genus.
  Can have multiple varieties or cultivars.
- variety (German: Varietät):
  Has the main characteristics of its species but differs in heritable characteristics.
  Can have multiple cultivars.
- cultivar (abbreviated from cultivated variety, German: Sorte):
  Has the main characteristics of its species or variety but differs in minor heritable characteristics.
  These characteristics were cultivated on purpose.
- hybrid:
  Hybrids are otherwise not relevant for PermaplanT's functionality.
- attributes of plants (traits in scientific literature):
  A characteristic of a variety, species, genus, subfamily or family.
  E.g. height, width, color, etc.
  Attributes can be defined on different levels of the hierarchy.
  E.g. a variety can have a different height than the species it belongs to.
- polyculture (aka companion planting, German: Mischkultur):
  Mutually beneficial way of growing plants together.
- relationship:
  Two plants are in a non-neutral relationship if they either enhance (companion)
  or diminish (antagonist) each other's health and growth.
- companion (to plant according polyculture):
  Plants that should be planted together.
- antagonist (to plant according polyculture):
  Plants that should be avoided next to each other.
- plant database (German: Pflanzen-Datenbank):
  PermaplanT's large collection of plant entries with comprehensive data, indexed with a unique name.
- inventory (German: Inventar):
  A personal collection of plants, e.g., seeds.
  Every entry of the inventory links to a plant in the plant database.
  Furthermore, they have an additional name and are more precisely describing a plant than the plant database could do.
  Only in the inventory you can have seeds plants which are not in the plant database, e.g., of special, new or unknown varieties.
- seedproof (German: Samenfest):
  From the seeds of a fruit you get again similar fruits.
- raising (German: Anzucht, vorziehen)
- (German: Vorkulturen)
- (German: Sortenrein, ohne/wenig Vermischung anderer Sorten, wenig/keine Fremdbestäubung)
- zone (in permaculture, German: Permakultur Zonen):
  Is an area which has the same frequency of human visitors.
  The areas are numbered from:
  - 00: (represented numerically as -1)
  - 0: physical body of permaculturist
  - 1: extremely frequently visited
  - 2: frequently visited
  - 3: less frequently visited
  - 4: rarely visited
  - 5: usually not visited
  - 6: never visited/protection zone

## Layers

- enable (a layer):
  Changes the canvas in a way that _elements_ in the enabled layer are the ones to be edited, selected and added.
  When working together on a map, every user can enable the layer of their choice.
- visibility and opacity (of a layer):
  The elements in a layer are (not) shown or with a user-selected transparency.
- alternative (of a layer):
  An alternative (of a layer) is a named clone of a layer.
  It is possible to _select_ one alternative of a layer.
  Each alternative can be edited independently.
- select (a layer):
  To choose one alternative of one layer.
  E.g. if there are several plants layers, a user can select only one of these alternatives at once.
  When working together on a map, every user can select their own layers.
- offline availability:
  Means that layers can be edited also offline, data gets synced when device is online again.

## Testing

- unit test:  
  Used to test parts of our code in isolation.  
  See [test doc](../tests) for further information.  
  Example: Test an individual function for specific behavior.
- integration test:  
  Used to test if different parts of the code work together correctly.  
  See [test doc](../tests) for further information.  
  Example: Make an HTTP request to the backend and let it run through controller, service and persistence layer requiring a running database.
- end to end test (e2e test):  
  Used to test the whole application from end to end.  
  Example: Simulate a user clicking a button (e.g. with [Selenium](https://www.selenium.dev/)) resulting in an HTTP request to the backend. Wait for the response and validate the resulting change in the frontend.
- acceptance tests:
  Black box system tests of a user story.
  Usually performed as regressions tests prior to a release.
  They are performed by engineers during the development phase.
- system tests:
  Tests the whole system towards the requirements definition and specification documents.
  This can invole functional and non-functional tests (performance, security, etc.).
  They are super set of end-to-end tests which can be done manually and/or automatically.
- user acceptance tests:
  Black box system tests towards customer requirements.
  Usually (subset of) system level tests conducted by the customer/user/domain expert.
  These tests makes sure that the solution provided by the system is accepted by the user.
  Similar to "Beta testing".
