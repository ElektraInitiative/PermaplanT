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
- Garden vegetables are in scope for now but tool could handle more.
- Diversity and ecological value plants should be included as well.

2. What databases to use?

- We started scraping permapeople.org.
  They are close to what Plants for a future provides except for plant relationships.
- Plants for a future is a popular one.
  - Will they allow us to use them?
  - It's constantly updating, how can this be reflected?
    - Scraping regularly?
    - Querying them at run time?
  - They will want mutual exchange.
    How can they benefit from our work?
    We should arrange a meeting with them to talk about this.
  - Pavlo already scraped this and has some article about this.
- Natural plant database (american) has more extensive data on relationships.
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
- This could be checked by Uliana but will be a lot of work if done manually.
  We could do this algorithmically.
  However, most of these databases are meant for humans and are hard to usefully scrape by programs.
- Plants for a future and Natural capital plant database have relationship info readily available in spreadsheet format.
  We can probably use the info if we don't use any of relationship details.
- Playing around with chatGPT could be an option.
  They quality might not be best here.
  Can we automate these queries or do we have to run each manually?

### Decisions

1. Uliana will start research on plant relationships.  
   First the quality of the following datasources has to be assessed.

   - [Plants for a Future](https://pfaf.org/)
   - [Natural Capital Plant Database](https://permacultureplantdata.com/)
   - [Permaculture News](https://www.permaculturenews.org/2010/07/30/companion-planting-guide/)

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
