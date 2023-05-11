import { authority, client_id, client_secret, redirect_uri } from './config';
import './styles/globals.css';
import { ComponentType, StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { AuthProvider } from 'react-oidc-context';

const container = document.getElementById('root') as HTMLElement;
const root = createRoot(container);

const onSigninCallback = (): void => {
  window.history.replaceState({}, document.title, window.location.pathname);
};

const oidcConfig = {
  authority,
  client_id,
  redirect_uri,
  client_secret,
  onSigninCallback: onSigninCallback,
};

function render(App: ComponentType) {
  root.render(
    <StrictMode>
      <AuthProvider {...oidcConfig}>
        <App />
      </AuthProvider>
    </StrictMode>,
  );
}

export default render;
