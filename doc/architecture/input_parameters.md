# Input Parameters

## Global for Garden

- Bodenschwereklassen: Bodenschwereklasse nach ÖNORM L 1050 auf Basis des österreichischen Texturdreiecks bzw. Bodenartendiagramms (ÖNORM L 1061) [Klassen]
  to be entered when creating a garden, from:
  - 1 sehr leicht/very light (S, uS)
  - 2 leicht/light (U, sU, IS)
  - 3 mittelschwer/medium (tS, sL, IU)
  - 4 schwer/heavy (sT, L, uL)
  - 5 sehr schwer/very heavy (T, IT)
- ph Wert (Bodenreaktion): Pflanzenauswahl (Kohl basisch, ph3 Heidelbeeren), dynamisch, **wichtig**
- Ages Ertragsklasse (NPK), eigentlich für Intensivkultur, 1-4 (Stark/Schwachzehrer)

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

- Abstände zu Bäume/Sträuche (Wurzel)
- Fruchtfolge, time (good bad successor plants)
- good/bad neighbor
- wet/dry places (e.g. by Oberflächenwasser or watering)

### Later Versions

- Straßennähe (Salz, Staub)
- Baumkronenüberschattung/Overshadowing
