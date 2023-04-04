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

async function fetchAllPlants() {
  const allPlants = [];
  const response = await axios.get(apiUrl, { headers });
  let plants = response.data.plants;
  let i = 0;
  while (plants.length > 0) {
    // if (i == 1) break;
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
  }

  return allPlants;
}

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
