import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ComponentType } from 'react';

/**
 * A decorator to wrap stories in a QueryClientProvider.
 * Use this decorator for components that use useQuery.
 *
 * @param Story The story to wrap in a QueryClientProvider
 * @returns The story wrapped in a QueryClientProvider
 */
export const QueryClientProviderDecorator = (Story: ComponentType) => {
  const queryClient = new QueryClient();
  return (
    <QueryClientProvider client={queryClient}>
      <Story />
    </QueryClientProvider>
  );
};
