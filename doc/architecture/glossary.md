# Glossary

## Basics

- PermaplanT:
  the planning app implemented in this repository
- map:
  The main planning utility for PermaplanT, which contains _elements_ in several _layers_.
- Nextcloud map:
  A Nextcloud app which is used as overview where which garden is, see [here](https://apps.nextcloud.com/apps/maps).
- version (of a map):
  A version (of a map) is a named snapshot of a map at a certain point in time while working on that map.
  It is possible to switch to a different version of a layer.
  It is similar to the undo-redo feature with the difference that the snapshots:
  - are persistent
  - have a name and
  - any specific snapshot can be selected.
- offline:
  Means the ability to use a feature without Internet connection, i.e., without calling REST APIs.
- canvas:
  The main and middle part of the screen which provides the planning/drawing functionality.
- elements (of a map in a layer):
  Can be drawn or added to the map via drag and drop.
  They have _attributes_.
- canvas context
  - canvas node elements i.e. HTML representation of rectangle, circle, etc. on the canvas
- map context
  - layers and their attributes e.g. warning layer and its visibility
- reversible deletion vs undo-redo functionality
  - reversible deletion: a database entity i.e. map and plant is deleted and can be restored within a certain time
  - undo-redo functionality: a user can undo and redo changes in the map, but the changes are local to the frontend and not stored in the database
- lazy loading
  - Lazy loading refers to the process of loading data on-demand, rather than loading everything upfront during the initial load of the app.
- offloading of the frontend state
  - the process of cleaning up the frontend state by removing data that has already been synchronized with the backend and is no longer needed. This can help to reduce the amount of unnecessary data in the frontend, which can improve the performance and efficiency of the application.
- first contentful paint (FCP)
  - the time it takes for the browser to render the first bit of content on the page.
- time to interactive (TTI)
  - the time it takes for the page to become fully interactive.
- The Document Object Model (DOM)
  - the data representation of the objects that comprise the structure and content of a document on the web.

## Biology

- seedproof (German: Samenfest):
  From the seeds of a fruit you get again similar fruits.
- raising (German: Anzucht, vorziehen)
- (German: Vorkulturen)
- Taxonomy:
  A scientific classification of plants into hierarchical groups.
  See [wikipedia](https://en.wikipedia.org/wiki/Plant_taxonomy) for details.
- Rank:
  Rank is a level within taxonomy.
  Plants within one taxonomic rank share traits with each other.
  The levels relevant for PermaplanT are (high to low):
  - Family
  - Subfamily (optional)
  - Genus
  - Species or Hybrid
  - Variety (optional)
- Family:
  A taxonomic rank that consists of multiple genera or subfamilies.
- Subfamily:
  A taxonomic rank which is part of a family.
  Consists of multiple genera.
- Genus:
  A taxonomic rank which is part of a family or subfamily.
  Consists of multiple species.
- Species:
  A taxonomic rank which is part of a genus.
  Can have multiple varieties.
  Members of one species are able to breed and produce offspring.
- Variety:
  Has the main characteristics of its species but differs in minor heritable characteristics.
- Hybrid:
  Resulting individual from cross-pollination of species or varieties.
- (German: Sortenrein, ohne/wenig Vermischung anderer Sorten, wenig/keine Fremdbestäubung)
- attributes (traits):
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
- Zone (in permaculture, German: Permakultur Zonen):
  Is an area which has the same frequency of human visitors.
  The areas are numbered from:
  - 00 (represented numerically as -1)
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
  E.g. if there are several plant layers, a user can select only one of these alternatives at once.
  When working together on a map, every user can select their own layers.
- offline availability:
  Means that layers can be edited also offline, data gets synced when device is online again.

## Testing

- unit test:  
  Used to test parts of our code in isolation.  
  In the backend unit tests can be found in the `src/` directory. They are to be put in separate modules and annotated with `#[cfg(test)]` (that way they are only compiled when actually running tests).  
  Example: Test an individual function for specific behaviour.
- integration test:  
  Used to test if different parts of the code work together correctly.  
  In the backend integration tests can be found in the `tests/` directory (which is separate from the `src/` directory).  
  Example: Make an HTTP request to the backend and let it run through controller, service and persistance layer while mocking the database.
- end to end test (e2e test):  
  Used to test the whole application from end to end.  
  Example: Simulate a user clicking a button (e.g. with [Selenium](https://www.selenium.dev/)) resulting in an HTTP request to the backend. Wait for the response and validate the resulting change in the frontend.
