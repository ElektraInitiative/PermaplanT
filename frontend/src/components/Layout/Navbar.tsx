import { DarkModeSwitcher } from '../../features/dark_mode';
import { useDarkModeStore } from '../../features/dark_mode';
import LanguageSwitcher from '../../features/landing_page/components/LanguageSwitcher';
import ButtonLink from '../Button/ButtonLink';
import { LoginButton } from '@/features/auth/components/LoginButton';
import { useSafeAuth } from '@/hooks/useSafeAuth';
import { ReactComponent as LogoSmallGraySVG } from '@/svg/permaplant-logo-gray.svg';
import { ReactComponent as LogoSmallSVG } from '@/svg/permaplant-logo.svg';
import { useTranslation } from 'react-i18next';

/**
 * The navigation component that is fixed on the top.
 *
 */
const Navbar = () => {
  const darkMode = useDarkModeStore((state) => state.darkMode);
  const { t } = useTranslation(['routes']);
  const auth = useSafeAuth();
  const backendVersion = sessionStorage.getItem('backend_version');
  const navbarItems = (
    <div className="flex items-center">
      <ul className="pt-1">
        <li>
          <ButtonLink title={t('routes:maps')} to="/maps" className="pe-4 text-lg font-medium" />
          <ButtonLink title={t('routes:seeds')} to="/seeds" className="text-lg font-medium" />
        </li>
      </ul>
    </div>
  );

  return (
    // z-index 1001 is needed because of leaflet GeoMap
    <nav className="fixed left-0 top-0 z-[1001] h-16 w-full items-center border-b-[0.5px] border-neutral-200 bg-white dark:border-neutral-700 dark:bg-neutral-100-dark">
      <div className="mx-auto flex h-full max-w-screen-xl flex-wrap items-center justify-between">
        <div className="flex space-x-16">
          <div className="flex space-x-6">
            <a href="/" className="flex items-center">
              {darkMode ? (
                <LogoSmallSVG className="h-12 w-12 pr-2" />
              ) : (
                <LogoSmallGraySVG className="h-12 w-12 pr-2" />
              )}
              <div className="flex flex-col">
                <span className="self-center whitespace-nowrap text-2xl font-semibold dark:text-white">
                  PermaplanT
                </span>
                <span className="mt-auto text-xs text-gray-500 dark:text-gray-400">
                  {' '}
                  {backendVersion}
                </span>
              </div>
            </a>
          </div>
          {auth.isAuthenticated && navbarItems}
        </div>
        <div className="flex md:order-2">
          <div className="flex items-center space-x-4">
            <DarkModeSwitcher />
            <LanguageSwitcher />
            <button
              data-collapse-toggle="navbar-sticky"
              type="button"
              className="inline-flex items-center rounded-lg p-2 text-sm text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600 md:hidden"
              aria-controls="navbar-sticky"
              aria-expanded="false"
            >
              <span className="sr-only">Open main menu</span>
              <svg
                className="h-6 w-6"
                aria-hidden="true"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                  clipRule="evenodd"
                ></path>
              </svg>
            </button>
            <LoginButton></LoginButton>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
