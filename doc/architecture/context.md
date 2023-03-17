# Input Parameters

## Soil

Global value and local values in the Soil layer:

- soil weight class (German: Bodenschwereklasse nach ÖNORM L 1050 auf Basis des österreichischen Texturdreiecks bzw. Bodenartendiagramms (ÖNORM L 1061) [Klassen])
  from:
  - 1 very light (S, uS) (German: sehr leicht)
  - 2 light (U, sU, IS) (German: leicht)
  - 3 medium (tS, sL, IU) (German: mittelschwer)
  - 4 heavy (sT, L, uL) (German: schwer)
  - 5 very heavy (T, IT) (German: sehr schwer)
- pH base value for topsoil from 0-14
  (German: Bodenreaktion, e.g. Kohl basisch, ph3 Heidelbeeren), dynamisch:
  - 1 very acid (pH 5.0 and below)
  - 2 acid (pH 6.0 - 6.5)
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
- (SkelG: Skelettgehalt: Anteil der Anteil der Korngrößenfraktion > 2 mm (Grobanteil) am Mineralboden [%])
  first version we assume geringer Grobanteil `<= 10%`
- Available water capacity
- Field capacity
- Permanent wilting point
- (Gesamtniederschlag - Verdunstung)
  first version: use data from Ostösterreich

## Local (for each place in the Garden)

- distances to plants/trees (German: Abstände zu Bäume/Sträuche)
- wind
- shadows
- surface water, i.e., wet/dry places (German: Oberflächenwasser)
- habitats
- permaculture zones, see [glossary](glossary.md)

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

All of this information can be present and overwritten on any level of the hierarchy, the most concrete information takes presence.

# Output Parameters

- which seeds are needed (seedling plants excluded)
- coordinates of plants to plant
- warnings (violation of natural constraints etc.)

### Later Versions

- weather alerts
