import NavContainer from './components/Layout/NavContainer';
import Pages from './routes/Pages';
import { useEffect } from 'react';
import { useAuth } from 'react-oidc-context';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const useInitDarkMode = () => {
  const darkMode = localStorage.getItem('darkMode');

  useEffect(() => {
    if (darkMode === 'true') {
      document.documentElement.classList.add('dark');
    } else {
      localStorage.setItem('darkMode', 'false');
    }
  }, [darkMode]);
};

function App() {
  const auth = useAuth();
  useInitDarkMode();

  // authentication notifications
  useEffect(() => {
    console.log('auth loading: ', auth.isLoading);
    if (auth.error) {
      toast(`Oops... ${auth.error.message}`);
    }
    switch (auth.activeNavigator) {
      case 'signinSilent':
        toast('Signing you in...');
        break;
      case 'signoutRedirect':
        toast(`Signing you out...`);
    }
    console.log('authenticated: ', auth.isAuthenticated);
    if (auth.isAuthenticated) {
      toast(`Hello ${auth.user?.profile.sub}`);
    }
  }, [auth]);

  return (
    <>
      <NavContainer>
        <Pages />
      </NavContainer>
      <ToastContainer
        position="top-right"
        progressClassName={() =>
          'Toastify__progress-bar--animated bottom-0 left-0 origin-left absolute h-1 w-full bg-primary-500 dark:bg-primary-300'
        }
      />
    </>
  );
}

export default App;
