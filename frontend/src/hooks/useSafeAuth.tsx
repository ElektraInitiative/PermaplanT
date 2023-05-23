import i18next from '@/config/i18n';
import { User, UserManagerEvents } from 'oidc-client-ts';
import { useContext } from 'react';
import { AuthContext, AuthContextProps } from 'react-oidc-context';
import { toast } from 'react-toastify';

const MockAuthContext: AuthContextProps = {
  settings: {
    authority: 'https://localhost:5001',
    client_id: 'test',
    redirect_uri: 'https://localhost:3000',
  },
  events: null as unknown as UserManagerEvents,
  clearStaleState: () => Promise.resolve(void 0),
  removeUser: () => Promise.resolve(void 0),
  signinPopup: () => Promise.resolve(null as unknown as User),
  signinSilent: () => Promise.resolve(null),
  signinRedirect: () => {
    toast.error(i18next.t('auth:error_no_backend'));
    return Promise.resolve(void 0);
  },
  signoutRedirect: () => Promise.resolve(void 0),
  signoutPopup: () => Promise.resolve(void 0),
  signoutSilent: () => Promise.resolve(void 0),
  querySessionStatus: () => Promise.resolve(null),
  revokeTokens: () => Promise.resolve(void 0),
  startSilentRenew: () => Promise.resolve(void 0),
  stopSilentRenew: () => Promise.resolve(void 0),
  isLoading: false,
  isAuthenticated: false,
};

export function useSafeAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    return MockAuthContext;
  }

  return context;
}
