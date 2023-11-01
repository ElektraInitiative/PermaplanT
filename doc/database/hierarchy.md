# Hierarchy

This document explains the hierarchy of the plants table.
Please make sure that you already read the [biology section of the glossary](../architecture/12glossary.md).

## Introduction

The plants table contains entries of:

- concrete plants, or
- abstract plants (representants of ranks)

_Concrete plants_ can be:

- dragged and dropped to the map and
- used as seed entry.

_Abstract plants_ can be:

- used to inherit attributes.

A concrete plant can be of following rank:

- on species level, or
- on variety level, or
- on cultivar level.

Furthermore following must be true:

- genus is below a family,
- specie is below a genus,
- a variety is below a specie,
- a cultivar is below to a specie or a variety

The diagram below shows the hierarchy of entities with `height` and `width` as an example of attribute classification.

```mermaid
classDiagram

  class Family:::abstract {
    +int height
    +int width
  }
  class Genus:::abstract {
    +int height
    +int width
  }
  class Species {
    +int height
    +int width
  }
  class Variety {
    +int height
    +int width
  }
  class Cultivar {
    +int height
    +int width
  }

  Variety <|-- Cultivar
  Species <|-- Cultivar
  Species <|-- Variety
  Genus <|-- Species
  Family <|-- Genus
```

Each of these entities can have their own attributes.
E.g., a variety below a specie can have different height than the specie itself.

## Unique Name

In the database we have a column `unique_name`.
The unique name are, either for abstract plants:

- single latin word to specify "family", which always ends on: `-aceae`
- single latin word to specify "genus"

Or is built up by several words (for concrete plants):

- single latin word to specify "genus"
- single latin word to specify "specie"
- optional single latin word to specify "variety"
- optional several words in single quotes to specify "cultivar", which starts with a capital letter

E.g. `Brassica oleracea italica 'Ramoso calabrese'`

### Hybrid Names

Hybrid names are built up differently.
Either two parent binomials, separated by a "x" or "×" or a given binomial, with or without an intercalated "×"
(see [Wikipedia](https://en.wikipedia.org/wiki/Hybrid_name)).
So the name does not necessarily say if a plant is a hybrid.

There is no special handling of hybrid names necessary, as the hybrid name is stored as unique name in the database.

### Displaying the Unique Name

The unique name of a plant should be displayed as follows:

- Latin name should be displayed in _italics_.
- The cultivar name should be in regular font, enclosed in single quotes (as stored in the database).

For example: _Brassica oleracea italica_ 'Ramoso calabrese'

The unique name alone usually is not displayed.

### Displaying the Complete Name

The complete name of a plant should be displayed as follows:

- If there is a common name, the common name appears first and should start with a capital letter (e.g., "tomato" becomes "Tomato").
- If it is a plant name from the seed database, the name continues with hyphen `-` and the additional name.
- This is followed by the unique name in brackets, unique name as described above in [Unique Name](###unique-name).

The general format is:

Common name - additional name (_unique name_)

In cases where the common name is not available in the current language, it should be displayed as:

_unique name_ - additional name

The cultivar is a part of the unique name.

For example (assuming Brassica oleracea italica doesn't have a common name):

- Italian broccoli - violett (_Brassica oleracea italica_ 'Ramoso calabrese')
- Italian broccoli - violett (_Brassica oleracea italica_)
- Italian broccoli (_Brassica oleracea italica_)
- _Brassica oleracea italica_ 'Ramoso calabrese' - violett
- _Brassica oleracea italica_ 'Ramoso calabrese'
- _Brassica oleracea italica_ - violett
- _Brassica oleracea italica_

### Displaying the Short Name

The short name should be displayed as follows:

- Common name or, if common name is not not available, the unique name as described above in [Unique Name](###unique-name).
- If additional name is available, `-` and the additional name should be appended.

For example (assuming Abies mariesii and Brassica oleracea italica don't have common names):

- Tomato - Gelbe Birne
- _Abies mariesii_
- _Brassica oleracea italica_ 'Ramoso calabrese' - violett

### Usage of Plant Names

- The short name is for overview, e.g. when you see all labels in the map editor at once (plant labels).
- The complete name should always be given if the user wants to know precisely which plant she is dealing with, e.g.:
  - when the mouse is hovering over a plant in the plant layer,
  - in search results or
  - in plant details (left bottom toolbar).
- The additional name must always be added if a plant is connected with a seed.

### Rules

We know about names (abstract and concrete, including hybrid):

- If it contains more than one word, it is a concrete plant.
- If it contains only one word, it is an abstract plant (family or genus).
- All entries with 2 words are a specie (de: Art),
- All entries with 3 or more words are either:
  - variety (de: Varietät) if all is spelled italic, or
  - are cultivar (de: Sorte) if last part of the name (can be more than 1 word!) is not latin, not italic, is in 'single quotes'
- All entries with a single x between the words are hybrid.
  We treat them like specie.

## Attributes

Columns are documented in their [respective structs](https://github.com/ElektraInitiative/PermaplanT/blob/master/backend/src/model/entity.rs).

We prefer strongly-typed data, e.g.:

- enums
- array of enums
- numbers

Columns that contain text should be postfixed with:

- `_en` for English text
- `_de` for German text

As we often copy data from other sources, we maintain following columns for external references:

- `external_source`: an array from enum where the first entry is the "main source" the other columns refer to:
- `external_id`: an identifier of that source
- `external_url`: the URL from where the data was taken

Plants are additionally classified as:

- is_concrete_plant (is a concrete plant as opposite to an abstract plant)
- is_tree (as search help within the tree layer)

### from Permapeople

Following columns are removed:

- `environment` (and its references)
- `type` and `is_variety`, as variety is now determined from the name (`rank` to be calculated from name, see above)
- `wildflower`
- `plants_of_the_world_online_name_synonym` (redundant to link)
- `dutch_name`, `danish_name`, `french_name`
- `when_to_harvest`
- `propagation_cuttings`
- `alternate_scientific_name`
- `hortipedia`
- `invasive_in`
- `years_to_bear`
- `useful_tropical_plants`
- `thinning`
- `light_tolerance`
- `chill_hours`, `beef_tomato`, `invasive`
- `folder_name` (at least in DB)
- `native_climate_zones`
- `adapted_climate_zones`
- `propagation_direct_sowing`

Other minor problems:

- fix Labiatae to be lamiaceae (family rank)
- Remove all "var." from the database entries (staying with the 3 words).

### from Reinsaat

Unique name:

- use `Scientific name subheading` together with `name` (as cultivar, see above) for our `unique_name`
  (`Cucurbita ssp.` from `Scientific name kulturhinweise` shouldn't exist)
- Remove all occurrences of `L.`, `MIll.`, and `var.`.
- Entries on Reinsaat that are spelled like "Brassica oleracea convar. botrytis var. italica" <https://www.reinsaat.at/shop/EN/brassica/broccoli/limba/> exist in our database as "Brassica oleracea italica".
  Add the Reinsaat entry to our database in a different row with the following nomenclature:
  Brassica oleracea italica 'Limba', with `Brassica oleracea italica` as parent, by following rules:
  - Remove the term "convar." and its following word.
  - Remove the "ssp." and its following word.
- The `name` maps to cultivar (de: Sorte), i.e. a rank below variety and is expressed in non-latin words, such as 'Limba'.
  In our database we want them:
  - back together in one name (the unique name, as described above) e.g. Brassica oleracea italica 'Limba' or Malus domestica 'Gala'.
  - with a link to the variety, if present, otherwise species

Individual problems:

- Daucus carota L. ssp. sativus --> Daucus carota sativus
- Petroselinum crispum ssp. tuberosum --> Petroselinum crispum tuberosum
- Papaver somnif. var. paeonifl. --> Papaver somniferum paeoniflorum
- Alcea rosea fl. pl. --> Alcea rosea flore pleno
- Campanula lat. macr. --> Campanula latifolia macrantha
- Malva sylvestris ssp. maur. --> Malva sylvestris mauritiana
- Sonnenblume, Velvet Queen: `None` should be `Helianthus annuus`

## Further Readings

- Rationale is explained [in this decision](../decisions/database_plant_hierarchy.md).
