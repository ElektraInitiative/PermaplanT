import { getAuthInfo } from './features/auth/api/getAuthInfo';
import { QueryClient, QueryClientProvider, useQuery } from '@tanstack/react-query';
import { ReactNode } from 'react';
import { AuthProvider } from 'react-oidc-context';
import { BrowserRouter } from 'react-router-dom';

interface ProviderProps {
  children: ReactNode;
}

const queryClient = new QueryClient();

const getOidcConfig = async () => {
  //TODO: store config in store
  const config = await getAuthInfo();

  return {
    authority: config.issuer_uri,
    client_id: config.client_id,
    redirect_uri: window.location.href,
    onSigninCallback: onSigninCallback,
  };
};

const onSigninCallback = (): void => {
  window.history.replaceState({}, document.title, window.location.pathname);
};

function AuthProviderWrapper({ children }: ProviderProps) {
  const { isLoading, isError, data, error } = useQuery({
    queryFn: getOidcConfig,
    queryKey: ['oidcConfig'],
  });
  if (isLoading) {
    return <div>Loading...</div>;
  }
  if (isError) {
    return <div>{'error occured: ' + error}</div>;
  }
  return <AuthProvider {...data}>{children}</AuthProvider>;
}

export function Providers({ children }: ProviderProps) {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProviderWrapper>
        <BrowserRouter>{children}</BrowserRouter>
      </AuthProviderWrapper>
    </QueryClientProvider>
  );
}
