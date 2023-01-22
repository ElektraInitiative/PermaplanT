import axios from 'axios';

export interface NewSeedDTO {
  name: string;
  variety_id: number;
  harvest_year: number;
  use_by?: Date;
  price?: number;
  quality?: string;
  quantity: string;
  origin?: string;
  generation?: number;
  notes?: string;
  taste?: string;
  yield?: string;
  tags: string[];
}

export function createSeeds(newSeedDTO: NewSeedDTO) {
  console.log(newSeedDTO);
  axios
    .post('http://localhost:8080/api/seeds', newSeedDTO)
    .then((response) => {
      console.log(response);
    })
    .catch((error) => {
      console.log(error);
    });
}
