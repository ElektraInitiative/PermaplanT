import { getAuthInfo } from './features/auth';
import { errorToastGrouped } from '@/features/toasts/groupedToast';
import { QueryCache, QueryClient, QueryClientProvider, useQuery } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { ReactNode } from 'react';
import { AuthProvider } from 'react-oidc-context';
import { BrowserRouter } from 'react-router-dom';

declare module '@tanstack/query-core' {
  interface QueryMeta {
    autoClose?: false | number;
    errorMessage?: string;
  }
}

interface ProviderProps {
  children: ReactNode;
}

const queryClient = new QueryClient({
  queryCache: new QueryCache({
    onError: (error, query) => {
      if (query.meta?.errorMessage && typeof query.meta.errorMessage === 'string') {
        errorToastGrouped(query.meta.errorMessage, {
          autoClose: query.meta.autoClose,
          toastId: query.meta.toastId,
        });
      }
    },
  }),
});

const getOidcConfig = async () => {
  const config = await getAuthInfo();
  sessionStorage.setItem('authority', config.issuer_uri);
  sessionStorage.setItem('client_id', config.client_id);
  sessionStorage.setItem('backend_version', config.version);
  const redirect_uri = window.location.href.split('?')[0];
  return {
    authority: config.issuer_uri,
    client_id: config.client_id,
    redirect_uri,
    onSigninCallback: onSigninCallback,
  };
};

const onSigninCallback = (): void => {
  window.history.replaceState({}, document.title, window.location.pathname);
};

function AuthProviderWrapper({ children }: ProviderProps) {
  const { data } = useQuery({
    queryFn: getOidcConfig,
    queryKey: ['oidcConfig'],
  });

  if (!data) {
    return <>{children}</>;
  }

  return <AuthProvider {...data}>{children}</AuthProvider>;
}

export function Providers({ children }: ProviderProps) {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProviderWrapper>
        <BrowserRouter>
          {children}
          <ReactQueryDevtools position="top-left" panelPosition="left" />
        </BrowserRouter>
      </AuthProviderWrapper>
    </QueryClientProvider>
  );
}
