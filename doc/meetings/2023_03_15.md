# Meeting 2023-03-15 Polyculture Algorithm

_Protocolled by: Benjamin_

## Attendees:

- Benjamin Zinschitz
- Markus Raab
- Pavlo Ardanov
- Uliana
- Yvonne Markl

## Preparations:

- look at http://visegrad.permakultura.sk/polycultures/

## Agenda:

- Polyculture Basics
- Presenting the pencil mockup
- Modules of Tool
- Introduction in Spreadsheets -> skipped
- Taxonomy: Family/Genus
- type of garden:
  - forest garden
  - ...
- Test Data

## Meeting notes:

Pavlo wanted to know if we want to build our own database or combine data from multiple external ones at run time.
We will definitely go for the former.

Pavlo talked about the three modules that make up his [tool](http://visegrad.permakultura.sk/polycultures/).

1. Plant Requirements/Zones  
   Choose plants based on their environmental needs.  
   e.g. pH-value, soil density, lighting conditions, etc.
2. Known Plant Companions  
   Some plants work well with each other based on empirical evidence.  
   e.g. the aetheric oil emitted by one plant repels pests for another plant.
3. Trait-based approach  
   Two plants with different traits complement each other.

Approach one seems quite straight forward as long as we have sufficient data quality of requirements in our database and the user has good knowledge of her site.

We could populate the database with known companions for approach two.
The question where to get this data from remains open for now.

There are hundreds of traits which can factor in for approach three.
We need to find and define the ones with the most impact on plant growth speed, healthiness and crop yield while considering what data we have available.
According to Pavlo the most important traits are shoot & root morphology while speed of growth and differences in point of harvest should also be considered.

We need to decide for which climate zone our algorithm should work.  
For now we will settle for the middle european climate zone (cold winters, hot and dry summers).

There were also some ideas for the functionality of the app.

- When plants are suggested the vegetation period could be considered as well.
- We could pre-compute some some polyculture groups with a mix of approaches one and two.
  Considering the site details and preselected plants whole groups could be offered as suggestions.
- In addition to suggesting what to plant we can suggest how to plant groups.
  Mixing seeds, placing them in rows or other shapes, etc.
- Because people are creatures of habit we could suggest plants that are less used and have a high ecological value.
  E.g. attracts wildlife, bees, etc.
