# PermaplanT Scraper

## Requirements

- nodejs 19.4.0
- npm

## Installation and Usage

1. Install dependencies

```shell
npm install
```

2. Start the scraper

In this step data is scraped from the source webpage and stored in the `data` folder in a csv format. There are two types of data that can be scraped: `list` with all available plants and `details` for each specific plant. The scraper can be started with the following commands.

Fetch plants list:

```shell
npm run fetch:list
```

Fetch details for each plant in the list:

```shell
npm run fetch:details
```

Combine both methods with a single command:

```shell
npm run fetch
```

3. Insert data into database

After the data is scraped and stored in `csv` format, we should now insert it into the database. This can be done with the following commands:

```shell
npm run insert:list
```

```shell
npm run insert:details
```

```shell
npm run insert
```
