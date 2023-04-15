# Scrapers

This directory contains the following scrapers:

- [PracticalPlants](/scraper/doc/practicalplants_scraper.md)
- [Permapeople](/scraper/doc/permapeople_scraper.md)
- [Reinsaat](/scraper/doc/reinsaat_scraper.md)

## Requirements

- nodejs v14.21.2
- npm

## Installation and Usage

The following steps describe how to use the scraper to fetch the data from the sources and insert it into the database.
The steps are simplified and only the most important commands are listed.
For more information, please refer to the documentation linked above of the individual scrapers.

1. Install dependencies

```shell
npm install && mkdir -p data
```

2. Create .env file from .env.example and fill in the required values:

```shell
cp .env.example .env
```

3. Fetch the data

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

4. Merge the scraped datasets

The scraper also merges the scraped data of all the sources and stores it in `csv` format in the `data` directory:

- `mergedDatasets.csv`: This file contains the merged datasets

This can be done with the following command:

```shell
npm run merge:datasets
```

5. Insert the data into the database

The scraper also inserts the scraped data into the database:

```shell
npm run insert
```
