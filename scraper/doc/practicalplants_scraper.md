# Scraper for PracticalPlants

PracticalPlants are not officially maintained since 2013, however, there is a dump of the entire webpage available in our [cloned repository](https://github.com/ElektraInitiative/practicalplants).
The scraper scrapes the data from the PracticalPlants wiki dump and stores it in `csv` format in the `data` directory.

## Installation and Usage

1. Install dependencies

```shell
npm install && mkdir -p data
```

2. Create .env.local file from .env.example and fill in the required values:

```shell
cp .env.example .env.local
```

`PRACTICALPLANTSPATH` mentioned in .env is the path on your local filesystem to the PracticalPlants wiki dump, which could be fetched from our [repository](https://github.com/ElektraInitiative/practicalplants).
This is required to scrape the data.

3. Start the scraper

The scraper scrapes the data from the PracticalPlants wiki dump and stores it in `csv` format in the `data` directory. This can be done with the following command:

```shell
npm run fetch:practicalplants
```

There will be several CSV files generated in the `data` directory:

- `detail.csv`: This file contains the data scraped from the PracticalPlants wiki dump.
- `errors.csv`: This file contains the errors encountered during the scraping process.
  The columns in the file identify the type of error i.e. which part of the data was missing.
  The main error type occurs under the column "Plant Datatable" and represents listing pages e.g. [/abelia][https://practicalplants.org/wiki/abelia/].
