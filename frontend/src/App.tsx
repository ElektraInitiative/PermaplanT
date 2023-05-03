import NavContainer from './components/Layout/NavContainer';
import Pages from './routes/Pages';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Fragment } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

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
      <ToastContainer
        position="top-right"
        progressClassName={() =>
          'Toastify__progress-bar--animated bottom-0 left-0 origin-left absolute h-1 w-full bg-primary-500 dark:bg-primary-300'
        }
      />
    </div>
  );
}

export default App;
