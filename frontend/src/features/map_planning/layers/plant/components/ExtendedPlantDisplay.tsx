import { PlantsSummaryDto } from '@/bindings/definitions';

function capitalizeFirstLetter(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

class ExtendedPlantsSummary implements PlantsSummaryDto {
  id: number;
  unique_name: string;
  common_name_en?: string[];

  constructor(plant: PlantsSummaryDto) {
    this.id = plant.id;
    this.unique_name = plant.unique_name;
    this.common_name_en = plant.common_name_en;
  }

  get displayName() {
    const common_name = this.common_name_en ? this.common_name_en.map(capitalizeFirstLetter) : null;
    const common_name_joined = common_name ? common_name.join(', ') : null;
    if (this.unique_name.includes("'")) {
      const splitString = this.unique_name.split("'");

      return {
        common_name: common_name_joined,
        unique_name: splitString[0].trim(),
        cultivar: splitString[1].trim(),
      };
    }
    return {
      common_name: common_name_joined,
      unique_name: this.unique_name,
    };
  }
}

const ExtendedPlantsSummaryDisplayName = ({ plant }: { plant: PlantsSummaryDto }) => {
  const transformedPlant = new ExtendedPlantsSummary(plant);

  return (
    <span>
      {transformedPlant.displayName.common_name ? (
        <>
          {transformedPlant.displayName.common_name} (
          <i>{transformedPlant.displayName.unique_name}</i>
          {transformedPlant.displayName.cultivar
            ? ` '${transformedPlant.displayName.cultivar}'`
            : ''}
          )
        </>
      ) : (
        <>
          <i>{transformedPlant.displayName.unique_name}</i>
          {transformedPlant.displayName.cultivar
            ? ` '${transformedPlant.displayName.cultivar}'`
            : ''}
        </>
      )}
    </span>
  );
};
export default ExtendedPlantsSummaryDisplayName;
