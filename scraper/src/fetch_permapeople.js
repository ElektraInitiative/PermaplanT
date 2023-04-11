import axios from 'axios';
import fs from 'fs';
import { parse as json2csv } from 'json2csv';
import { config } from 'dotenv';

config();

const apiUrl = 'https://permapeople.org/api/plants/';
const headers = {
  'x-permapeople-key-id': process.env.PERMAPEOPLE_KEY_ID,
  'x-permapeople-key-secret': process.env.PERMAPEOPLE_KEY_SECRET,
};

/**
 * Fetch all plants from permapeople API.
 * The API returns 100 plants per page.
 * This function fetches all the pages sequentially.
 * The API has a rate limit, so we add a sleep of 1 second between each request.
 * The information related to each plant is stored in a nested array called data.
 * This function additionally flattens the data array to make it convenient to work with in the next step when writing to csv.
 *
 * @returns Array of plants
 */
async function fetchAllPlants() {
  const allPlants = [];

  const response = await axios.get(apiUrl, { headers });
  let plants = response.data.plants;
  let i = 0; // Page number just for logging

  while (plants.length > 0) {
    console.log(`Fetching page ${i + 1}`);

    plants.forEach((plant) => {
      plant = plant.data.reduce((acc, curr) => {
        acc[curr.key] = curr.value;
        return acc;
      }, plant);
      delete plant.data;
      allPlants.push(plant);
    });

    const plant = plants.pop();
    const plantId = plant.id;

    const plantResponse = await axios.get(`${apiUrl}?last_id=${plantId}`, {
      headers,
    });
    plants = plantResponse.data.plants;
    i++;

    await new Promise((resolve) => setTimeout(resolve, 1000)); // Add a sleep of 1 second
  }

  return allPlants;
}

/**
 * Write the plants to a csv file
 * @param {*} plants Array of plants
 */
function writePlantsToCsv(plants) {
  if (!fs.existsSync('data')) {
    fs.mkdirSync('data');
  }
  const csv = json2csv(plants);
  fs.writeFileSync('data/permapeopleRawData.csv', csv);
  return plants;
}

fetchAllPlants()
  .then((plants) => writePlantsToCsv(plants))
  .catch((error) => console.error(error));
