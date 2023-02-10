# PermaplanT Scraper

## Requirements

-   nodejs v14.21.2
-   npm

## Installation and Usage

1. Install dependencies

```shell
npm install && mkdir -p data
```

2. Create .env file from .env.example and fill in the required values

```shell
cp .env.example .env
```

`PRACTICALPLANTSPATH` is the path on your local filesystem to the Practical Plants wiki dump, that could be fetched from our [repository](https://github.com/ElektraInitiative/practicalplants). This is required to scrape the data.

3. Start the scraper

```shell
npm run start
```

4. Correct data manually and merge with generated data (optional)

The scraped data contains inconsistencies and mistakes made by practicalplants users. In order to correct these mistakes, we need to manually correct the data. The corrected data should be stored in the same format as the generated data i.e. columns may not be changed. Since the scraper process could be changed in the future, we should garantee that the data will not be lost when the scraper is run again. Therefore, we should merge the corrected data with the generated data. This can be done with the following command:

```shell
npm run merge <path-to-original-csv-file> <path-to-corrected-csv-file>
```

5. Insert data into database

After the data is scraped and stored in `csv` format, we should now insert it into the database. This can be done with the following command:

_Note:_ Please make sure that the database is up-to-date with latest migrations before running this command.

```shell
npm run insert
```

