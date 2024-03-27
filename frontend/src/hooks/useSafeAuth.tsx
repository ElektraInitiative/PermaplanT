import { User, UserManagerEvents } from 'oidc-client-ts';
import { useContext } from 'react';
import { AuthContext, AuthContextProps } from 'react-oidc-context';
import i18next from '@/config/i18n';
import { errorToastGrouped } from '@/features/toasts/groupedToast';
import { useIsOnline } from './useIsOnline';

/**
 * A fallback for the `AuthContext` from 'react-oidc-context'.
 * Each operation is a no-op, optionally displaying an error message.
 *
 * This fallback is not used by the `AuthProvider` from 'react-oidc-context'.
 * It is only used by the `useSafeAuth` hook to prevent an undefined context error.
 */
const AuthContextFallback: AuthContextProps = {
  settings: {
    authority: '',
    client_id: '',
    redirect_uri: '',
  },
  events: null as unknown as UserManagerEvents,
  clearStaleState: () => Promise.resolve(void 0),
  removeUser: () => Promise.resolve(void 0),
  signinPopup: () => Promise.resolve(null as unknown as User),
  signinSilent: () => Promise.resolve(null),
  signinRedirect: () => {
    errorToastGrouped(i18next.t('auth:error_no_backend'), { autoClose: false });
    return Promise.resolve(void 0);
  },
  signoutRedirect: () => Promise.resolve(void 0),
  signoutPopup: () => Promise.resolve(void 0),
  signoutSilent: () => Promise.resolve(void 0),
  querySessionStatus: () => Promise.resolve(null),
  revokeTokens: () => Promise.resolve(void 0),
  startSilentRenew: () => Promise.resolve(void 0),
  stopSilentRenew: () => Promise.resolve(void 0),
  isLoading: true,
  isAuthenticated: false,
};

/**
 * Safe version of the useAuth() hook from 'react-oidc-context'.
 * If the AuthContext is not yet initialized, a AuthContextFallback is returned.
 */
export function useSafeAuth() {
  const context = useContext(AuthContext);

  useIsOnline({
    onOffline() {
      context?.stopSilentRenew();
    },
    onOnline() {
      loginAndReload();

      async function loginAndReload() {
        try {
          await context?.signinSilent();

          window.location.reload();
        } catch (error) {
          console.error(error);
        }
      }
    },
  });

  if (!context) {
    return AuthContextFallback;
  }

  return context;
}
