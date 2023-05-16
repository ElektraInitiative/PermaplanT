import { LoadingSpinner } from './components/LoadingSpinner/LoadingSpinner';
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
  console.log(config);
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

  const SpinnerWrapper = (
    <div className="z-1000 absolute left-1/2 top-1/2 h-16 w-16 translate-x--1/2 translate-y--1">
      <LoadingSpinner />
    </div>
  );

  if (isLoading) {
    return (
      <div>
        <p>Loading...</p>
        {SpinnerWrapper}
      </div>
    );
  }
  if (isError) {
    return (
      <div>
        <p>{'error occured: ' + error}</p>
        {SpinnerWrapper}
      </div>
    );
  }
  if (!data) {
    return (
      <div>
        <p>config empty</p>
        {SpinnerWrapper}
      </div>
    );
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
