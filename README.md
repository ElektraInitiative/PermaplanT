# Perma Plan(t)

Perma Plan(t) is a Web App for

- Web (Firefox, Chromium)
- Progressive Web App (PWAs) Android 9+

It has a server-side component with a database for plants.

## Goal

The overall goal of the web app is to enable planning:

- with good yield, while still
- providing a fully functioning and diverse ecosystem.

To achieve that:

- suggestion for:
  - increasing diversity, not only what was used recently
  - what fits well in the time of the year
- visual indication for:
  - what makes sense for the given constraints
  - what improves diversity and the ecosystem

## Non-functional Goals

- easy to use
- efficient to use
- beautiful UI

## Features

- layers (see below)
- undo
- copy&paste of selection
- zoom
- translation: English, German
- everything included: no external JavaScript, Fonts, etc.

Later:

- Nextcloud integration (calender entries, Deck tasks)
- GPS tagging in the field

### Layers

In all layers --- but base --- current, past or future entities might be intermixed.
In any layer other layers might be displayed or hidden.

- Base¹ (import base image, define borders, scale, orient)
- Landscape¹ (height&sketch of permanent structures like walls, ponds, buildings, beds)
- Trees¹ (stem position&height&sketch&type of trees, bushes etc.)
- Shadows (more/less sun exposure)
- Wind (more windy places)
- Zones
- Animals (where Ducks may walk)
- Infrastructure (cables, wifi spots, pipes, ...)
- PH values
- Dry/Wet (watering systems, surface water, ...)
- Paths (ways, fences, stepping stones)
- Plants¹

¹ Essential (most used) layers: are more prominently shown than others.
