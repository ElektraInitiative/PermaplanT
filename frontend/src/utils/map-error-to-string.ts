import { AxiosError, isAxiosError } from 'axios';
import { isDev } from '@/config';

const errorMap = {
  ERR_NETWORK:
    'A network error occurred. Please check your internet connection and then try again.',
  ERR_UNKNOWN: 'An unknown error occurred, please try again.',
  ERR_BAD_RESPONSE: 'Our server had a problem processing your request. This is probably our fault.',
};

/**
 * Maps an error to a string for the user to read.
 *
 * @param error the error to map
 * @returns a sensible error message for the user or if there is no mapping,
 * the original error message
 */
function mapErrorToString(error: Error, includeOriginalMessage = isDev) {
  let mappedErrorMessage = '';

  if (isAxiosError(error)) {
    mappedErrorMessage = mapAxiosErrorToString(error);
  }

  if (mappedErrorMessage) {
    return includeOriginalMessage ? `${mappedErrorMessage} (${error.message})` : mappedErrorMessage;
  }

  return includeOriginalMessage
    ? `${errorMap.ERR_UNKNOWN} (${error?.message ?? 'No original error message'})`
    : error?.message ?? errorMap.ERR_UNKNOWN;
}

function mapAxiosErrorToString(error: AxiosError) {
  switch (error.code) {
    case 'ERR_NETWORK':
      return errorMap.ERR_NETWORK;

    case 'ERR_BAD_RESPONSE':
      return errorMap.ERR_BAD_RESPONSE;

    default:
      return errorMap.ERR_UNKNOWN;
  }
}

export default mapErrorToString;
