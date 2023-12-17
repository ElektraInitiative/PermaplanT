# Scraper for Permapeople

The official documentation for the Permapeople API can be found [here](https://permapeople.org/knowledgebase/api-docs.html).

## Installation and Usage

1. Install dependencies

```shell
npm install && mkdir -p data
```

2. Create .env.local file from .env.example and fill in the required values:

```shell
cp .env.example .env.local
```

- `PERMAPEOPLE_KEY_ID` (called `API_KEY_ID` by permapeople) and
- `PERMAPEOPLE_KEY_SECRET` (called `API_KEY_SECRET` by permapeople)

mentioned in .env are the credentials for the Permapeople API.
This is required to use their API.
You can get these keys from the Permapeople team after creating an account.

3. Start the scraper

The scraper scrapes the data from the Permapeople API and stores it in `csv` format in the `data` directory. This can be done with the following command:

```shell
npm run fetch:permapeople
```

4. Compare the scraped data with the data in the database **(optional)**

The scraper can also compare the scraped data with the data in the database (this data will be referenced as practicalPlants data and vice versa) and store the differences in `csv` format in the `data` directory.
The script needs the `detail.csv` and `permapeopleRawData.csv` files in the `data` directory to compare the data.
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

- `both` - the data is present in both scraped data and the database.
- `practicalPlants` - the data is present in the database but not in scraped data.
- `permapeople` - the data is present in scraped data but not in the database.
