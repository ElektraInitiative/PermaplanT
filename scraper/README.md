# PermaplanT Scraper

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

`PRACTICALPLANTSPATH` mentioned in .env is the path on your local filesystem to the Practical Plants wiki dump, that could be fetched from our [repository](https://github.com/ElektraInitiative/practicalplants). This is required to scrape the data.

3. Start the scraper

The scraper will scrape the data from the Practical Plants wiki dump and store it in `csv` format in the `data` directory. This can be done with the following command:

```shell
npm run start
```

As an additional step the script will also lookup the german common name through Wikidata API and store it under the column `Column Name DE` in the `detail.csv` file.

There will be several CSV files generated in the `data` directory:

- `detail.csv`: This file contains the data scraped from the Practical Plants wiki dump.
- `distinctFamily.csv`: This file contains the distinct family names scraped from the Practical Plants wiki dump.
- `distinctGenus.csv`: This file contains the distinct genus names scraped from the Practical Plants wiki dump.
- `errors.csv`: This file contains the errors encountered during the scraping process. The columns in the file identify the type of error i.e. which part of the data was missing. The main error type occurs under the column "Plant Datatable" and represents listing pages e.g. [/abelia][https://practicalplants.org/wiki/abelia/].

4. Correct data manually and merge with generated data (optional)

The scraped data contains inconsistencies and mistakes made by practicalplants users. In order to correct these mistakes, we need to manually correct the data i.e. copy the `detail.csv` file into a new file. The corrected data in the new file should be stored in the same format as the generated data i.e. columns may not be changed. Since the scraper process could be changed in the future, we should garantee that the data will not be lost when the scraper is run again. Therefore, we should merge the corrected data with the generated data.

Please note the following points when correcting the data:

- The `Binomial name` column should not be changed.
- The `To check` is a flag column that indicates whether the data needs to be checked again. The value of this column shows the reasons for the check concatinated with a comma i.e. which columns need to be checked. There are 2 possible values right now:
  - `Is Variety`: the column is set to true if the binomial name contains more than 2 words.
  - `Mature Size or Height`: column contains non numeric values.

The merge script takes two CSV files as command line arguments, merges the data from the two files based on a common key `binomial_name`, and writes the merged data to a new CSV file called `merged.csv`.

This can be done with the following command:

```shell
npm run merge <path-to-original-csv-file> <path-to-corrected-csv-file>
```

5. Insert data into database

After the data is scraped and stored in `csv` format, we should now insert it into the database. You should provide the path either to the `merged.csv` file or original `detail.csv` as the command line argument.

Along with the data, the script will also insert the `distinctFamily.csv` and `distinctGenus.csv` data created during the scraping step into the database.

This can be done with the following command:

```shell
npm run insert <path-to-csv-file>
```

_Note:_ Please make sure that the database is up-to-date with latest migrations before running this command.
