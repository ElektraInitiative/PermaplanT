import { QueryCache } from '@tanstack/react-query';
import { errorToastGrouped } from '@/features/toasts/groupedToast';

/**
 * Holds the query key constants for react-query
 */
export const QUERY_KEYS = {
  PLANTINGS: 'plantings',
  SHADINGS: 'shadings',
  LAYERS: 'layers',
};

declare module '@tanstack/query-core' {
  interface QueryMeta {
    autoClose?: false | number;
    errorMessage?: string;
    toastId?: string;
  }
}

export const onError: QueryCache['config']['onError'] = (error, query) => {
  if (query.meta?.errorMessage && typeof query.meta.errorMessage === 'string') {
    errorToastGrouped(query.meta.errorMessage, {
      autoClose: query.meta.autoClose,
      toastId: query.meta.toastId,
    });
  }
};
