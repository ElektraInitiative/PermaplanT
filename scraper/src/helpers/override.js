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
    Object.keys(overridePlant).forEach((key) => {
      if (key !== "unique_name") {
        if (key === "new_unique_name") {
          // actually override the unique name
          key = "unique_name";
        }

        plants[index][key] = overridePlant[key].trim();
      }
    });
  });

  return plants;
}

export { applyOverride };
