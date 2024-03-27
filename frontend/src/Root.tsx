import { ComponentType, StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Providers } from './Providers';
import './styles/globals.css';

const container = document.getElementById('root') as HTMLElement;
const root = createRoot(container);

function render(App: ComponentType) {
  root.render(
    <StrictMode>
      <Providers>
        <App />
      </Providers>
    </StrictMode>,
  );
}

export default render;
