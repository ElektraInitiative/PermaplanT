import NavContainer from './components/Layout/NavContainer';
import Pages from './routes/Pages';
import { Fragment } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient();
function App() {
  if (localStorage.getItem('darkMode') === 'true') {
    document.documentElement.classList.add('dark');
  } else {
    localStorage.setItem('darkMode', 'false');
  }

  return (
    <div>
      <QueryClientProvider client={queryClient}>
        <Fragment>
          <BrowserRouter>
            <NavContainer>
              <Pages />
            </NavContainer>
          </BrowserRouter>
        </Fragment>
      </QueryClientProvider>
    </div>
  );
}

export default App;
