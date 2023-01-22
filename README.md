# PermaplanT

PermaplanT is an app for

- Web: Firefox, Chromium
- Larger mobile devices like tablets: Progressive Web App (PWA) Android 9+

## Goals

The overall goals of the app are to enable planning:

1. vital growth of delicious edible crops, while
2. providing a diverse and functioning ecosystem, and
3. creating outdoor living spaces for both animals & humans.

To achieve these goals the app provides, e.g.:

- visual indications for what:
  1. makes sense according to known and easily measurable natural constraints
  2. is practical for the gardener
  3. enhances diversity and supports the ecosystem
- suggestions for:
  - what is seasonal
  - increasing diversity

## Main Features

- users can have any number of maps
- users can work on the same map together
- maps have a fixed number of layers (see below)
- undo/redo within current session for changes in the map
- copy&paste of selection including succeeding crops across maps
- zoom
- internationalization: English, German
- algorithms for mixed crops, considerations of natural constraints and automatic suggestions
- privacy: no cookies, tracking, analytics, external JavaScript, fonts, etc.

### Layers

In all layers --- except for base --- past, current or future entities might be intermixed.
While editing any layer other layers might be displayed or hidden.

- Base¹ (import orthophoto or site plan as base image, define borders, scale, orientation)
- Landscape¹ (height&sketch of permanent structures like walls, ponds, constructions, beds)
- Labels (allows to put text labels, e.g. names for beds)
- Trees (taxa, stem position&height&sketch&type of forest, trees, hedge, bushes etc.)
- Wind (more or less windy places, wind orientation)
- Shadows (more/less sun exposure)
- Infrastructure (outlets, wifi spots, taps, water storage tanks, irrigation systems, ...)
- Hydrology (surface water runoff, natural reservoirs, gullies, rills, ...)
- Soil (pH Values of topsoil, subsoil)
- Paths (ways, fences, stepping stones)
- Habitats (taxa, areas for (wild)life, nesting aids, heaps of stones or leaves, perches)
- Zones (of different visitation frequency)
- Plants¹ (taxa, individual and fields of plants)
- Warnings¹

¹ Essential (most used) layers: are more prominently shown than others.

### Later Versions

Later features, i.e., out of scope for first version:

- Nextcloud integrations (calender entries, Deck tasks)
- import/export
- GPS coordinates
- weather data (warnings on frost etc.)
- hints&tips about pest control, fertilizer, care, etc.
- automatic shadow and moisture calculation
- 3D modes (forest garden)
- differences of versions of the same garden
- timelaps of historic garden development, simulate growth
- social network features (notification that someone entered the garden, Chat&Photograph layer)

## Non-functional Goals

- easy to use
- aesthetic UI
- collaborative use
