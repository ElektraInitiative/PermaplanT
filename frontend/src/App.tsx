import NavContainer from './components/Layout/NavContainer';
import { useSafeAuth } from './hooks/useSafeAuth';
import Pages from './routes/Pages';
import './styles/guidedTour.css';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import 'shepherd.js/dist/css/shepherd.css';

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
      console.error(auth.error.message);
      toast.error(t('auth:error_failed_authentication'), { autoClose: false });
    }
    switch (auth.activeNavigator) {
      case 'signinSilent':
        toast.info(t('auth:signing_in'));
        break;
      case 'signoutRedirect':
        toast.info(t('auth:signing_out'));
    }
  }, [auth, t]);

  const isAuth = auth.isAuthenticated;
  const preferredUsername = auth.user?.profile.preferred_username;

  useEffect(() => {
    if (isAuth) {
      toast.info(`${t('auth:hello')} ${preferredUsername}`, { icon: false });
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
      <ToastContainer />
    </>
  );
}

export default App;
