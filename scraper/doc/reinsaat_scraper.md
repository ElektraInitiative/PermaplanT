# Scraper for Reinsaat

There is no open API for the Reinsaat webpage.
Therefore, we need to scrape the data from the webpage, which can be found [here](https://www.reinsaat.at/).

## Installation and Usage

1. Install dependencies

```shell
npm install && mkdir -p data
```

2. Create .env.local file from .env.example and fill in the required values:

```shell
cp .env.example .env.local
```

3. Fetch the English and German data

The scraper scrapes the data from the Reinsaat webpage and stores it in `csv` format in the `data` directory:

- `reinsaatRawDataEN.csv`: This file contains the raw data scraped from the english version of the Reinsaat webpage.
- `reinsaatRawDataDE.csv`: This file contains the raw data scraped from the german version of the Reinsaat webpage.

This can be done with the following command:

```shell
npm run fetch:reinsaat
```

4. Merge the scraped data

The scraper also merges the scraped data of both the English and German version of the Reinsaat webpage and stores it in `csv` format in the `data` directory:

- `reinsaatRawData.csv`: This file contains the merged data

This can be done with the following command:

```shell
npm run merge:reinsaat
```
