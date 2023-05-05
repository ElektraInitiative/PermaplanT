import './styles/globals.css';
import { ComponentType, StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { AuthProvider } from 'react-oidc-context';

const container = document.getElementById('root') as HTMLElement;
const root = createRoot(container);

const oidcConfig = {
  authority: 'http://0.0.0.0:8081/realms/permaplant',
  client_id: 'frontend',
  redirect_uri: 'http://localhost:5173/login',
  client_secret: 'wbcEY4MpSZQeCkkBlf3cfLeb8jMihj7R',
  // ...
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
