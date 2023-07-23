import { PlantsSummaryDto } from '@/bindings/definitions';

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
    return {
      common_name: this.common_name_en ? this.common_name_en.join(', ') : '',
      unique_name: this.unique_name,
    };
  }
}

const ExtendedPlantsSummaryDisplayName = ({ plant }: { plant: PlantsSummaryDto }) => {
  const transformedPlant = new ExtendedPlantsSummary(plant);

  return (
    <span>
      {transformedPlant.displayName.common_name}(<i>{transformedPlant.displayName.unique_name}</i>)
    </span>
  );
};

export default ExtendedPlantsSummaryDisplayName;
