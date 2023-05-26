# Context & Scope

## Context

Users see PermaplanT as mere tool to replace books and their notes.
PermplanT envisions designing maps:

- collaboratively
- for agricultural purposes
- enabling fully documenting all plants:
  - for garden tours
  - for tracking harvesting
- reminding about what you don't see:
  - watering
  - fertilization
- with mulching
- but no dig

## Out of Scope

Later features that are out of scope for first version:

- weather data (automatically add rain to watering layer, warnings on frost etc.)
- hints&tips about pest control, fertilizer, care, etc.
- automatic shadow and moisture calculation
- 3D modes (forest garden), contour lines etc.
- time-lapse of historic garden development, simulate growth
- positions and distances relate to the real world, for example, you can use GPS coordinates
- GIS import/export

# Input Parameters

## Soil

Global value and local values in the Soil layer:

- soil texture (German: orientiert an Bodenschwereklasse nach ÖNORM L 1050 auf Basis des österreichischen Texturdreiecks bzw. Bodenartendiagramms (ÖNORM L 1061) [Klassen])
- pH base value for topsoil from 0-14
  (German: Bodenreaktion, e.g. Kohl basisch, ph3 Heidelbeeren), dynamic value using one decimal digit after the comma:
  - 1 very acid (pH 5.0 and below)
  - 2 acid (pH 5.1 - 6.5)
  - 3 neutral (pH 6.6 - 7.3)
  - 4 alkaline (pH 7.4 - 7.8)
  - 5 very alkaline (pH 7.9 and above)
- pH base value for subsoil from 0-14
- yield grade (German: Ages Gehaltsklasse (Nährstoffversorgung und Humusgehalt) ÖNORM L 1210, determined from NPK, eigentlich für Intensivkultur, Stark/Schwachzehrer)
  from:
  - A sehr niedrig
  - B niedrig
  - C ausreichend
  - D hoch
  - E sehr hoch

### Later Versions

- (Temperatursumme/Jahresmitteltemperatur)
  first version: use data from Ostösterreich
- (Vegetationsperiode)
  first version: use data from Ostösterreich
- (sun background: Sonnentage, Sonnenscheindauer h, from https://www.data.gv.at/katalog/dataset/1d9754ae-9e7b-4772-97c9-a030285d75bb)
  first version: use data from Ostösterreich
- (soil depth, BM: Bodenmächtigkeit: Mächtigkeit des durchwurzelbaren Mineralbodens [cm])
  first version: assume "sehr tiefgründig" `> 100cm`
- (SkelG: Skelettgehalt: Anteil der Korngrößenfraktion > 2 mm (Grobanteil) am Mineralboden [%])
  first version we assume geringer Grobanteil `<= 10%`
- Available water capacity
- Field capacity
- Permanent wilting point
- (Gesamtniederschlag - Verdunstung)
  first version: use data from Ostösterreich

## Local (for each place in the Garden)

- distances to plants/trees (German: Abstände zu Bäumen/Sträuchern)
- wind
- shadows
- surface water, i.e., wet/dry places (German: Oberflächenwasser)
- habitats
- permaculture zones, see [glossary](glossary.md)
- events: e.g. elements in the garden get added/removed accurate to the day

### Later Versions

- soil amendments
- mulching (Mulchen)
- influences of street (German: Einflüsse durch Straßennähe, wie Salz und Staub)
- automatic overshadowing (German: Baumkronenüberschattung)

## Plant Database

- hierarchy: family, subfamily, genus, species, variety
- if it is abstract/concrete (MISSING: we assume all plants of Practical Plants to be concrete)
- common English name
- common German name
- icon (MISSING)
- dates (MISSING):
  - begin/end raising
  - begin/end planting
  - begin/end seeding
  - begin/end harvest
- size (height, width)
- constraints where they want to be:
  - companions and antagonists to other specific plants of any hierarchy (MISSING)
  - recommended distances to any other plant, needed for area calculations (MISSING)
  - sun
  - soil weight
  - pH value of topsoil
  - nutrition demand (MISSING, start with "Nutritionally poor soil" in "Environmental Tolerances")
  - freeze resistance (hardiness zone)
  - wet/dry
  - preferable permaculture zone
- is a tree/bush
- notes German (MISSING)

All of this information can be present and overwritten on any level of the hierarchy, the most concrete information takes precedence.

# Output Parameters

- which seeds are needed (seedling plants excluded)
- coordinates of plants to plant
- warnings (violation of natural constraints etc.)

### Later Versions

- weather alerts
