import { authority, client_id, client_secret, redirect_uri } from './config';
import './styles/globals.css';
import { ComponentType, StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { AuthProvider } from 'react-oidc-context';
import { getAuthInfo } from './features/auth/api/getAuthInfo';

const container = document.getElementById('root') as HTMLElement;
const root = createRoot(container);

const onSigninCallback = (): void => {
  window.history.replaceState({}, document.title, window.location.pathname);
};

// let oidcConfig = {
//   authority,
//   client_id,
//   redirect_uri,
//   client_secret,
//   onSigninCallback: onSigninCallback,
// };

const getOidcConfig = async () => {
  const config = await getAuthInfo()
  return {
    authority: config.authorization_endpoint,
    client_id: config.client_id,
    redirect_uri: window.location.href,
    onSigninCallback: onSigninCallback,
  }
}

async function render(App: ComponentType) {
  const oidcConfig = await getOidcConfig()
  root.render(
    <StrictMode>
      <AuthProvider {...oidcConfig}>
        <App />
      </AuthProvider>
    </StrictMode>,
  );
}

export default render;
