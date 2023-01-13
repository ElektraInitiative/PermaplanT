# Input Parameters

## Global for Garden

To be entered when creating a map.

- soil weight class (German: Bodenschwereklasse nach ÖNORM L 1050 auf Basis des österreichischen Texturdreiecks bzw. Bodenartendiagramms (ÖNORM L 1061) [Klassen])
  from:
  - 1 very light (S, uS) (German: sehr leicht)
  - 2 light (U, sU, IS) (German: leicht)
  - 3 medium (tS, sL, IU) (German: mittelschwer)
  - 4 heavy (sT, L, uL) (German: schwer)
  - 5 very heavy (T, IT) (German: sehr schwer)
- pH base value from 0-14
  (German: Bodenreaktion, e.g. Kohl basisch, ph3 Heidelbeeren), dynamisch
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
- (Gesamtniederschlag - Verdunstung)
  first version: use data from Ostösterreich

## Local (for each place in the Garden)

- distances to plants/trees due to roots (German: Abstände zu Bäume/Sträuche because of Wurzeln)
- moisture, i.e., wet/dry places (German: Oberflächenwasser)
- pH local value from 0-14 to do corrections of the base value on specific places
- animal and habitat influences
- zones (German: Zonen)
- wind
- sun/shadow

### Later Versions

- influences of street (German: Einflüsse durch Straßennähe, wie Salz und Staub)
- automatic overshadowing (German: Baumkronenüberschattung)

## Plant Database

- photos
- general infos
- size/distances
- constraints where they want to be:
  - sun
  - soil weight
  - pH value
  - yield grade
  - freeze resistance
  - good/bad neighbors
  - wet/dry
  - preferable zone

# Output Parameters

- coordinates of plants to plant
- yield (Ertrag)

### Later Versions

- weather alerts
