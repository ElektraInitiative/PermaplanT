# Scrapers

This directory contains the following scrapers:

- [PracticalPlants](/scraper/doc/practicalplants_scraper.md)
- [Permapeople](/scraper/doc/permapeople_scraper.md)
- [Reinsaat](/scraper/doc/reinsaat_scraper.md)

## Requirements

- nodejs v14.21.2
- npm

## Installation and Usage

Configure your environment:

1. Install dependencies

```shell
npm install && mkdir -p data
```

2. Create .env.local file from .env.example and fill in the required values:

```shell
cp .env.example .env.local
```

### Installation Option 1: With a single command

The following command will fetch the data from the sources, merge the datasets, apply the overrides and insert the data into the database:

```shell
npm run start:full
```

If you would like to skip the fetching steps and import your csv files from Nextcloud, you can use the following command:

```shell
npm run start
```

**_Note:_** you will need the following files in the `data` directory:

1. `detail.csv` - scraped from PracticalPlants
2. `permapeopleRawData.csv` - scraped from Permapeople
3. `reinsaatRawData.csv` - scraped from Reinsaat and merged from `reinsaatRawDataEN.csv` and `reinsaatRawDataDE.csv`
4. `germanCommonNames.csv` - scraped from wikidata

### Installation Option 2: Step by Step

The following steps describe how to use the scraper to fetch the data from the sources and insert it into the database.
The steps are simplified and only the most important commands are listed.
For more information, please refer to the documentation of the individual scrapers linked in the first paragraph of this doc.

1. Fetch the data

The scraper scrapes the data from the sources and stores it in `csv` format in the `data` directory:

```shell
npm run fetch:practicalplants
```

```shell
npm run fetch:permapeople
```

```shell
npm run fetch:reinsaat && npm run merge:reinsaat
```

The scraped data is stored in the `data` directory:

- `detail.csv`: This file contains the raw data scraped from the PracticalPlants webpage.
- `permapeopleRawData.csv`: This file contains the raw data scraped from the Permapeople webpage.
- `reinsaatRawDataEN.csv`: This file contains the raw data scraped from the english version of the Reinsaat webpage.
- `reinsaatRawDataDE.csv`: This file contains the raw data scraped from the german version of the Reinsaat webpage.
- `reinsaatRawData.csv`: This file contains the merged data scraped from the english and german version of the Reinsaat webpage.
- `germanCommonNames.csv`: This file contains the German common names fetched from https://www.wikidata.org

2. Merge the scraped datasets

The scraper also merges the scraped data of all the sources and stores it in `csv` format in the `data` directory:

- `mergedDatasets.csv`: This file contains the merged datasets

This can be done with the following command:

```shell
npm run merge:datasets
```

3. Fetch German common names

Goes through all unique names from mergedDatasets.csv and fetches the German common names from https://www.wikidata.org concurrently. Then merges them into `mergedDatasets.csv`

If it starts throwing 429 errors, reduce MAX_CONCURRENT_REQUESTS to a lower number, such as 10.

```shell
npm run fetch:germannames && npm run merge:germannames
```

4. Apply overrides

The scraped data can contain inconsistencies and errors.
In order to correct these mistakes, we can create override files.
`data/overrides` may contain any number of `csv` files, which are applied consecutively to `mergedDatasets.csv` to create `finalDataset.csv`

For details see `data/overrides/README.md`

```shell
npm run apply:overrides
```

5. Insert the data into the database

The scraper also inserts the scraped data into the database:

```shell
npm run insert:plants
```

6. Insert relations into the database

The scraper inserts the relation data into the database.

First you need to download the `Companions.csv` and `Antigonist.csv` file from the nextcloud server or export them yourself from the current `Plant_Relations.ods`.  
Copy them into the /data directory and run:

```shell
npm run insert:relations
```
