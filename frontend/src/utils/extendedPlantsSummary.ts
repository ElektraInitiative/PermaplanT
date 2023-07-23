import { PlantsSummaryDto } from '@/bindings/definitions';

/*
    //get current language state de or english right now
    switch case
    case de
      return not implemented yet
    case eng
    default
    let name = common_name_en


    return name(<italic>PlantsSummaryDto.uniquename</italic>)

    except of cultivar, which is in 'single quotes' but not italic??
    muss vielleicht noch uniquename aufspalten oder das dto erweitern das ich cultivar bekomme
  */

class ExtendedPlantsSummary implements PlantsSummaryDto {
  id: number;
  unique_name: string;
  common_name_en?: string[];

  constructor(plant: PlantsSummaryDto) {
    this.id = plant.id;
    this.unique_name = plant.unique_name;
    this.common_name_en = plant.common_name_en;
  }

  get displayName(): string {
    return this.unique_name + ' - ' + (this.common_name_en ? this.common_name_en.join(', ') : '');
  }
}

export { ExtendedPlantsSummary };
