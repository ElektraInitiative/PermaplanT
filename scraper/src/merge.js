import { writeFileSync } from 'fs';
import { parse as json2csv } from 'json2csv';
import csv from 'csvtojson';
import { config } from 'dotenv';
config();

if (process.argv.length < 4) {
  console.log('USAGE: npm run merge <generated-file> <corrected-file>');
  process.exit(1);
}

const generatedFile = process.argv[2];
const correctedFile = process.argv[3];

const jsonArray = await csv().fromFile(generatedFile);
const jsonArrayCorrected = await csv().fromFile(correctedFile);

function mergeArrays(generated, corrected) {
  const merged = [];
  corrected.forEach((obj) => {
    const found = generated.find((item) => {
      return item.binomial_name === obj.binomial_name;
    });
    if (found) {
      merged.push({ ...found, ...obj });
    }
  });

  return merged;
}

const merged = mergeArrays(jsonArray, jsonArrayCorrected);

const mergedCsv = json2csv(merged);
writeFileSync('data/merged.csv', mergedCsv);
