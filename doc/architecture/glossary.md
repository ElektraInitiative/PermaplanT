# Glossary

-   map:
    The main planning utility for PermaplanT, which contains _elements_ in several _layers_.
-   Nextcloud map:
    A Nextcloud app which is used as overview where which garden is, see [here](https://apps.nextcloud.com/apps/maps).
-   offline:
    Means the ability to use a feature without Internet connection, i.e., without calling REST APIs.
-   seedproof (German: Samenfest):
    From the seeds of a fruit you get again similar fruits.
-   raising (German: Anzucht, vorziehen)
-   (German: Vorkulturen)
-   (German: Sortenrein, ohne/wenig Vermischung anderer Sorten, wenig/keine Fremdbestäubung)
-   attributes (of plants):
    A characteristic of a variety, species, genus, subfamily or family.
    E.g. height, width, color, etc.
    Attributes can be defined on different levels of the hierarchy.
    E.g. a variety can have a different height than the species it belongs to.
-   polyculture (aka companion planting, German: Mischkultur):
    Mutually beneficial way of growing plants together.
-   companion (to plant according polyculture):
    Plants that should be planted together.
-   antagonist (to plant according polyculture):
    Plants that should be avoided next to each other.
-   zone (in permaculture, German: Permakultur Zonen):
    Is an area which has the same frequency of human visitors.
    The areas are numbered from:
    -   00 (represented numerically as -1)
    -   0: physical body of permaculturist
    -   1: extremely frequently visited
    -   2: frequently visited
    -   3: less frequently visited
    -   4: rarely visited
    -   5: usually not visited
    -   6: never visited/protection zone
-   canvas:
    The main and middle part of the screen which provides the planning/drawing functionality.
-   elements (of a map in a layer):
    Can be drawn or added to the map via drag and drop.
    They have _attributes_.
-   enable (a layer):
    Changes the canvas in a way that _elements_ in the enabled layer are the ones to be edited, selected and added.
-   visibility and opacity (of a layer):
    The elements in a layer are (not) shown or with a user-selected transparency.
-   version (of a map):
    A version (of a map) is a named snapshot of a map at a certain point in time while working on that map.
    It is possible to switch to a different version of a layer.
    It is similar to the undo-redo feature with the difference that the snapshots have a name and any of them can be selected.
-   alternative (of a layer):
    An alternative (of a layer) is a named clone of a layer.
    It is possible to _select_ one alternative of a layer.
    Each alternative can be edited independently.
-   select (a layer):
    To choose one alternative of one layer.
    E.g. if there are several plant layers, only one of these alternatives can be selected at once.
-   canvas context
    -   TBD Konva elements e.g. rectangle, circle, etc.
-   map context
    -   TBD layers and their attributes e.g. warning layer and its visibility
-   reversible deletion vs undo-redo functionality
    -   reversible deletion: a database entity i.e. map and plant is deleted and can be restored within a certain time
    -   undo-redo functionality: a user can undo and redo changes in the map, but the changes are local to the frontend and not stored in the database
