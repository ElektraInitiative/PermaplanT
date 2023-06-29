import NavContainer from './components/Layout/NavContainer';
import { useSafeAuth } from './hooks/useSafeAuth';
import Pages from './routes/Pages';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
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

const useAuthEffect = () => {
  const { t } = useTranslation(['auth']);
  const auth = useSafeAuth();
  useEffect(() => {
    if (auth.error) {
      toast(`Oops... ${auth.error.message}`);
    }
    switch (auth.activeNavigator) {
      case 'signinSilent':
        toast(t('auth:signing_in'));
        break;
      case 'signoutRedirect':
        toast(t('auth:signing_out'));
    }
  }, [auth, t]);

  const isAuth = auth.isAuthenticated;
  const preferredUsername = auth.user?.profile.preferred_username;

  useEffect(() => {
    if (isAuth) {
      toast(`${t('auth:hello')} ${preferredUsername}`);
    }
  }, [isAuth, t, preferredUsername]);
};

function App() {
  useInitDarkMode();
  useAuthEffect();
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
