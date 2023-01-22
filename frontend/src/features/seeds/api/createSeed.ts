import { NewSeed as NewSeedDTO } from '@/bindings/rust_ts_definitions';
import axios from 'axios';

export const createSeed = async (newSeedDTO: NewSeedDTO) => {
  axios
    .post('http://localhost:8080/api/seeds', newSeedDTO)
    .then((response) => {
      console.log(response);
    })
    .catch((error) => {
      console.log(error);
    });
};
