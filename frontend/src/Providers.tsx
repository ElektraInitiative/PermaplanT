import { QueryCache, QueryClient, QueryClientProvider, useQuery } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { ReactNode } from 'react';
import { AuthProvider } from 'react-oidc-context';
import { BrowserRouter } from 'react-router-dom';
import { onError } from '@/config/react_query';
import { queryOffline } from './config';
import { getAuthInfo } from './features/auth';

interface ProviderProps {
  children: ReactNode;
}

const queryClient = new QueryClient({
  // even when no internet connection is available, send stuff
  defaultOptions: {
    queries: {
      networkMode: queryOffline ? 'always' : undefined,
    },
    mutations: {
      networkMode: queryOffline ? 'always' : undefined,
    },
  },
  queryCache: new QueryCache({
    onError: onError,
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
