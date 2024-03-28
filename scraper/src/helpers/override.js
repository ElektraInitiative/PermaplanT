import csv from "csvtojson";

/**
 * Apply the given override file to the plants
 *
 * @param {*} plants - Array of plants
 * @param {*} file - The relative path of the csv file
 * @returns - The plants with the overrides applied
 *
 */
async function applyOverride(plants, file) {
  console.log(`[INFO] Applying override ${file}`);

  const overridePlants = await csv().fromFile(file);

  overridePlants.forEach((overridePlant) => {
    // find the plant
    const index = plants.findIndex(
      (plant) => plant.unique_name === overridePlant.unique_name
    );

    if (index === -1) {
      console.log(
        `[INFO] Could not find plant with unique_name '${overridePlant.unique_name}' in merged dataset.`
      );
      return;
    }

    // for each column in the override plant, update the plant
    Object.keys(overridePlant).forEach((source_key) => {
      if (source_key !== "unique_name") {
        let destination_key = source_key;
        if (source_key === "new_unique_name") {
          // actually override the unique name
          destination_key = "unique_name";
        }

        plants[index][destination_key] = overridePlant[source_key].trim();
      }
    });
  });

  return plants;
}

export { applyOverride };
