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

4. Insert data into database

After the data is scraped and stored in `csv` format, we should now insert it into the database. This can be done with the following command:

_Note:_ Please make sure that the database is up-to-date with latest migrations before running this command.

```shell
npm run insert
```
