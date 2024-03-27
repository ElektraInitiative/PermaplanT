import createCache from '@emotion/cache';
import { CacheProvider } from '@emotion/react';
import { QueryCache, QueryClient, QueryClientProvider, useQuery } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { ReactNode, useMemo } from 'react';
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

// https://react-select.com/styles#the-classnames-prop
// https://github.com/JedWatson/react-select/blob/master/storybook/stories/ClassNamesWithTailwind.stories.tsx
// This ensures that Emotion's styles are inserted before Tailwind's styles so that Tailwind classes have precedence over Emotion
function EmotionCacheProvider({ children }: { children: ReactNode }) {
  const cache = useMemo(
    () =>
      createCache({
        key: 'with-tailwind',
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion -- we know it's there
        insertionPoint: document.querySelector('title')!,
      }),
    [],
  );

  return <CacheProvider value={cache}>{children}</CacheProvider>;
}

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
          <EmotionCacheProvider>{children}</EmotionCacheProvider>
          <ReactQueryDevtools position="top-left" panelPosition="left" />
        </BrowserRouter>
      </AuthProviderWrapper>
    </QueryClientProvider>
  );
}
