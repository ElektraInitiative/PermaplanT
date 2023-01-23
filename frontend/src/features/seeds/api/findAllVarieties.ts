import { VarietyDto } from '../../../bindings/rust_ts_definitions';
import axios from 'axios';

export const findAllVarieties = async (
  onSuccess: (varieties: VarietyDto[]) => void,
  onError: (error: Error) => void,
) => {
  axios
    .get('http://localhost:8080/api/varieties')
    .then((response) => {
      onSuccess(response.data.data);
    })
    .catch((error: Error) => {
      onError(error);
    });
};
