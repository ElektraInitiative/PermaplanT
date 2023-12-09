import { onError } from '@/config/react_query';
import { QueryCache, QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { FormProvider, useForm } from 'react-hook-form';
import { ToastContainer } from 'react-toastify';

export interface TestDto {
  foo: string;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const FormWrapper = (props: any) => {
  const formMethods = useForm<TestDto>();

  return <FormProvider {...formMethods}>{props.children}</FormProvider>;
};

export const createQueryHookWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
    queryCache: new QueryCache({
      onError: onError,
    }),
  });

  return function Wrapper({ children }: { children: React.ReactNode }) {
    return (
      <QueryClientProvider client={queryClient}>
        {children}
        <ToastContainer></ToastContainer>
      </QueryClientProvider>
    );
  };
};
