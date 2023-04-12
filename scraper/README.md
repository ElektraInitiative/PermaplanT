# Scrapers

This directory contains the following scrapers:

- [PracticalPlants](#scraper-for-practical-plants)
- [Permapeople](#scraper-for-permapeople)

# Scraper for PracticalPlants

PracticalPlants are not maintained since 2013, however, there is a dump of the entire webpage available in our [cloned repository](https://github.com/ElektraInitiative/practicalplants).
The scraper will scrape the data from the PracticalPlants wiki dump and store it in `csv` format in the `data` directory.
See the [Installation and Usage](#installation-and-usage) section for more details.

## Requirements

- nodejs v14.21.2
- npm

## Installation and Usage

1. Install dependencies

```shell
npm install && mkdir -p data
```

2. Create .env file from .env.example and fill in the required values

```shell
cp .env.example .env
```

`PRACTICALPLANTSPATH` mentioned in .env is the path on your local filesystem to the PracticalPlants wiki dump, which could be fetched from our [repository](https://github.com/ElektraInitiative/practicalplants).
This is required to scrape the data.

3. Start the scraper

The scraper will scrape the data from the PracticalPlants wiki dump and store it in `csv` format in the `data` directory. This can be done with the following command:

```shell
npm run parse
```

As an additional step, the script will also look up the german common name through Wikidata API and store it under the column `Column Name DE` in the `detail.csv` file.

There will be several CSV files generated in the `data` directory:

- `detail.csv`: This file contains the data scraped from the PracticalPlants wiki dump.
- `distinctFamily.csv`: This file contains the distinct family names scraped from the PracticalPlants wiki dump.
- `distinctGenus.csv`: This file contains the distinct genus names scraped from the PracticalPlants wiki dump.
- `errors.csv`: This file contains the errors encountered during the scraping process.
  The columns in the file identify the type of error i.e. which part of the data was missing.
  The main error type occurs under the column "Plant Datatable" and represents listing pages e.g. [/abelia][https://practicalplants.org/wiki/abelia/].

4. Correct data manually and merge with generated data (optional)

The scraped data contains inconsistencies and mistakes made by PracticalPlants users.
In order to correct these mistakes, we need to manually correct the data i.e. copy the `detail.csv` file into a new file.
The corrected data in the new file should be stored in the same format as the generated data i.e. columns may not be changed.

Since the scraper process could be changed in the future, we should guarantee that the data will not be lost when the scraper is run again.
Therefore, we should merge the corrected data with the generated data.

Please note the following points when correcting the data:

- The `Binomial name` column should not be changed.
- The `To check` is a flag column that indicates whether the data needs to be checked again. The value of this column shows the reasons for the check concatenated with a comma i.e. which columns need to be checked. There are 2 possible values right now:
  - `Is Variety`: the column is set to true if the binomial name contains more than 2 words.
  - `Mature Size or Height`: column contains non-numeric values.

The merge script takes two CSV files as command line arguments, merges the data from the two files based on a common key `binomial_name`, and writes the merged data to a new CSV file called `merged.csv`.

This can be done with the following command:

```shell
npm run merge <path-to-original-csv-file> <path-to-corrected-csv-file>
```

5. Insert data into the database

After the data is scraped and stored in `csv` format, we should now insert it into the database.

Along with the plant data, we can now populate the `family` and `genus` tables from the files created during the scraping step.

This can be done with the following commands:

1. Inserts the data from the default-named `detail.csv`, `distinctFamily.csv` and `distinctGenus.csv` files into the
   database.

```shell
npm run insert
```

2. Inserts the plant data only from the specified `csv` file into the database. Keep in mind that due to the foreign key relationships, the `family` and `genus` tables should be populated before inserting the plant data.

```shell
npm run insert <path-to-csv-file>
```

3. Inserts the data from the specified `csv` file into the database. The second argument specifies the type of data to be inserted i.e. `family` or `genus`.

_Note:_ Please make sure that the database is up-to-date with the latest migrations before running this command.

# Scraper for Permapeople

The official documentation for the Permapeople API can be found [here](https://permapeople.org/knowledgebase/api-docs.html).

## Requirements

- nodejs v14.21.2
- npm

## Installation and Usage

1. Install dependencies

```shell
npm install && mkdir -p data
```

2. Create .env file from .env.sample and fill in the required values

```shell
cp .env.sample .env
```

`PERMAPEOPLE_KEY_ID` and `PERMAPEOPLE_SECRET_KEY` mentioned in .env are the credentials for the Permapeople API.
This is required to scrape the data.
You can get these keys from the Permapeople team.

3. Start the scraper

The scraper will scrape the data from the Permapeople API and store it in `csv` format in the `data` directory. This can be done with the following command:

```shell
npm run fetch:permapeople
```

_OPTIONAL:_
The scraper can also compare the scraped data with the data in the database(this data will be referenced as practicalPlants data and vice versa) and store the differences in `csv` format in the `data` directory.
This can be done with the following command:

```shell
npm run compare
```

There will be several CSV files generated in the `data` directory:

- `permapeopleRawData.csv`: This file contains the raw data scraped from the Permapeople API.
- `permapeopleDifferences.csv`: This file contains the differences between the scraped data and the data in the database.

### How the comparison works

The comparison is done by merging the scraped data with the data in the database.
The merge is done based on the `binomial_name` column on the side of PracticalPlants and `scientificName` column on the side of Permapeople.
There are 3 possible cases:

- `both` - the data is present in both scraped data and database.
- `practicalPlants` - the data is present in the database but not in scraped data.
- `permapeople` - the data is present in scraped data but not in database.
