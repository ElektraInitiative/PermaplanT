import { PlantsSummaryDto } from '@/api_types/definitions';
import { capitalizeFirstLetter } from '@/features/map_planning/utils/string-utils';

class ExtendedPlantsSummary implements PlantsSummaryDto {
  id: number;
  unique_name: string;
  common_name_en?: string[];

  constructor(plant: PlantsSummaryDto) {
    this.id = plant.id;
    this.unique_name = plant.unique_name;
    this.common_name_en = plant.common_name_en;
  }

  public get displayName() {
    const common_name = this.common_name_en ? this.common_name_en.map(capitalizeFirstLetter) : null;
    const common_name_joined = common_name ? common_name.join(', ') : '';
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

export { ExtendedPlantsSummary };
