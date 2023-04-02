# Meeting 2023-03-30 - Polyculture

_Protocolled by: Benjamin_

## Attendees:

- Benjamin
- Pavlo
- Uliana
- Markus
- Yvonne

## Agenda

- 09:00 Hello
- Which database (columns) are best?
- Grouping algorithms
- Taxonomy
- Test Data
- Participation of Uliana
- Tasks

## Discussions

1. What kind of plants do we want to address?

- Only vegetable and leafy green crops or more?
- The database contains many different plants, including trees, all available for a planner.
- For companions/antagonists, however, we focus on garden vegetables.
- Diversity and ecological value plants should be included as well.

2. What databases to use?

- We started scraping practicalplants.org and now integrate the data from permapeople.org.
  They are close to what Plants for a future provides except for plant relationships.
- Plants for a future is a popular one.
  - Will they allow us to use them?
  - It's constantly updating, how can this be reflected?
    - We want to get daily updates via their API.
  - They already sent us API keys.
    The current concept is: we update their wiki directly and then receive updates.
    We should arrange a meeting with them to talk about this.
- Natural plant database (American) has more extensive data on relationships.
- There are more important ones for polycultures (primary traits).

3. Which traits to use?

- When these are defined we can take a look at which databases we can use.
  - Examples are
    - Plant physiology
    - Growing period
    - ...
- Yvonne has already done an investigation of databases.
  That's why permapeople.org was chosen so far.
  But some things are missing in there (e.g. relationships and seeds).
  Quality check hasn't been done thoroughly.

4. For relationships, we would like to have a confidence score.

- We could also take relationship data from multiple sources and grade by this.
  How many databases say the same.
  Are there any contradictions?
-  Pavlo's concern is that a computer program would be more objective and efficient in the long term.
  Markus's concern is that scraping would be a big effort with little long-term benefits (scraping would need to be redone in future). 
  Therefore we concluded the work will be done manually by Uliana.
  To keep the work at an acceptable level, we only include common vegetables on higher taxonomical ranks.
  As far as we know, this is novel, as other databases don't define relationships on higher taxonomical ranks.
- Plants for a future and Natural capital plant database have relationship info readily available in spreadsheet format.
  We can probably use the info if we don't use any of relationship details.

### Decisions

1. Uliana will start research on plant relationships.  
   First the quality of the following datasources has to be assessed.

   - [Plants for a Future](https://pfaf.org/)
   - [Natural Capital Plant Database](https://permacultureplantdata.com/)
   - [Permaculture News](https://www.permaculturenews.org/2010/07/30/companion-planting-guide/)
   - [Kaggle](https://www.kaggle.com/datasets/aramacus/companion-plants) uses [Wikipedia](https://en.wikipedia.org/wiki/List_of_companion_plants)

   Then a collection of relationships in the following format is created.  
   You can find the document [here](https://docs.google.com/spreadsheets/d/1jtsng8H4SkwK2gxK_qF1XkC0ygpjXZgMUKKj1x3TA9M/).

   - Left side
     - Common name
     - Variety
     - Species
     - Genus
     - Subfamily
     - Family
     - Taxonomic rank
       - Variety
       - Species
       - Genus
       - Subfamily
       - Family
   - Right side
     - See Left side
   - Confidence
     - low
     - medium
     - high
     - approved
   - Relationship type
     - companion
     - antagonist
     - neutral
   - Notes
   - Sources
