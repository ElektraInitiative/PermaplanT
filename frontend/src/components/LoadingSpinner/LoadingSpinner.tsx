import { ReactComponent as LoadingSpinnerIcon } from '@/icons/loader-quarter.svg';

/**
 * Simple component for loading indication
 */
export const LoadingSpinner = () => {
  return <LoadingSpinnerIcon className="h-full w-full animate-spin stroke-secondary-200" />;
};
