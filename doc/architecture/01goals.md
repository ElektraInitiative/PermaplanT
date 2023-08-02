# Goals

The overall goals of the app are to enable planning:

1. vital growth of delicious edible crops, while
2. providing a diverse and functioning ecosystem, and
3. creating outdoor living spaces for both animals & humans.

To achieve these goals the app provides, e.g.:

- visual indications for permaculture:
  1. what makes sense according to known and easily measurable natural constraints
  2. is practical for the gardener
  3. enhances diversity and supports the ecosystem
- suggestions for:
  - what is seasonal
  - increasing diversity

## Non-functional Goals

1. aesthetic UI that is fun to use
2. low barriers for collaboration
3. low memory consumption and good performance
4. privacy: data should remain within Verein

## Main Features

- users have any number of maps
- maps have any number of layers (see below)
- some layers can have alternatives and/or can be used offline
- users work on alternatives of layers on the same map together
- undo/redo for changes in the map
- copy&paste of selection including succeeding crops across maps
- zoom
- internationalization: English, German
- algorithms for polyculture, considerations of natural constraints and automatic suggestions
- Nextcloud integrations (calender entries, Deck tasks)
- social network features (e.g. notification that someone entered your garden)
- privacy: no tracking, analytics, external JavaScript, fonts, etc.

## Layers

In all layers --- except for base --- past, current or future entities might be intermixed.
While editing any layer other layers are (transparently) displayed or hidden.

- Base[^note] (import photo or site plan as base image, define borders, scale, orientation)
- Terrain
- Landscape[^note] (height&sketch of permanent structures like walls, ponds, constructions, beds)
- Labels (allows to put text labels, e.g. names for beds)
- Trees (taxa, stem position&height&sketch&type of forest, trees, hedge, bushes etc.)
- Wind (more or less windy places, wind orientation)
- Shade (more/less sun exposure vs. shade)
- Infrastructure (outlets, wifi spots, taps, water storage tanks, irrigation systems, ...)
- Hydrology (surface water runoff, natural reservoirs, gullies, rills, ...)
- Soil (pH Values of topsoil, subsoil)
- Paths (ways, fences, stepping stones)
- Habitats (taxa, areas for (wild)life, nesting aids, heaps of stones or leaves, perches)
- Zones (of different visitation frequency)
- Plants[^note] (taxa, individual and fields of plants)
- Warnings[^note]
- Photos (sharing of photo with GPS coordinates and a Nextcloud chats per photo)
- Fertilization
- Watering
- Todos (creates Deck cards in Nextcloud)
- Drawing (for anything else)

[^note] Essential (most used) layers: are more prominently shown than others.

## Use Cases

For more details about each requirement, continue reading [Use Cases (Chapter)](../usecases).
