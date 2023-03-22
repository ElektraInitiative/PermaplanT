import { AxiosError, isAxiosError } from 'axios';

const errorMap = {
  ERR_NETWORK:
    'A network error occurred. Please check your internet connection and then try again.',
  ERR_UNKNOWN: 'An unknown error occurred, please try again.',
};

/**
 * Maps an error to a string for the user to read.
 *
 * @param error the error to map
 * @returns a sensible error message for the user or if there is no mapping,
 * the original error message
 */
function mapErrorToString(error: Error) {
  if (isAxiosError(error)) {
    return mapAxiosErrorToString(error);
  }

  return error?.message || errorMap.ERR_UNKNOWN;
}

function mapAxiosErrorToString(error: AxiosError) {
  switch (error.code) {
    case 'ERR_NETWORK':
      return errorMap.ERR_NETWORK;

    default:
      return errorMap.ERR_UNKNOWN;
  }
}

export default mapErrorToString;
