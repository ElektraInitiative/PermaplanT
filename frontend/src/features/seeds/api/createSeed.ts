import { NewSeedDTO } from '@/bindings/rust_ts_definitions';
import axios from 'axios';

export const createSeed = async (
  newSeedDTO: NewSeedDTO,
  onSuccess: () => void,
  onError: (error: Error) => void,
) => {
  console.log(JSON.stringify(newSeedDTO));
  axios
    .post('http://localhost:8080/api/seeds', newSeedDTO)
    .then((_) => {
      onSuccess();
    })
    .catch((error) => {
      onError(error);
    });
};
