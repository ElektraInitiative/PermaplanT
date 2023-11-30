import { DarkModeSwitcher } from '../../features/dark_mode';
import { useDarkModeStore } from '../../features/dark_mode';
import LanguageSwitcher from '../../features/landing_page/components/LanguageSwitcher';
import ButtonLink from '../Button/ButtonLink';
import IconButton from '../Button/IconButton';
import FullPageNav from './FullPageNav';
import { LoginButton } from '@/features/auth/components/LoginButton';
import { useSafeAuth } from '@/hooks/useSafeAuth';
import { ReactComponent as LogoSmallGraySVG } from '@/svg/permaplant-logo-gray.svg';
import { ReactComponent as LogoSmallSVG } from '@/svg/permaplant-logo.svg';
import { useState } from 'react';
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
  const [showFullPageNav, setShowFullPageNav] = useState(false);
  const navbarItems = (
    <ul className="flex items-center pt-1">
      <li>
        <ButtonLink title={t('routes:maps')} to="/maps" className="pe-4 text-lg font-medium" />
      </li>
      <li>
        <ButtonLink title={t('routes:seeds')} to="/seeds" className="text-lg font-medium" />
      </li>
    </ul>
  );

  const openFullPageNav = () => setShowFullPageNav(true);

  return (
    // z-index 1001 is needed because of leaflet GeoMap
    showFullPageNav ? (
      <FullPageNav close={() => setShowFullPageNav(false)}></FullPageNav>
    ) : (
      <nav
        className="
      fixed
      left-0
      top-0
      z-[1001]
      h-16
      w-screen
      items-center
      border-b-[0.5px]
      border-neutral-200
      bg-white
      dark:border-neutral-700
      dark:bg-neutral-100-dark
      "
      >
        <div className="mx-auto flex h-full max-w-screen-xl flex-wrap items-center justify-between px-4">
          <div className="flex space-x-16">
            <div className="flex space-x-6">
              <a href="/" className="flex items-center">
                {darkMode ? (
                  <LogoSmallSVG className="h-12 w-12 pr-2" />
                ) : (
                  <LogoSmallGraySVG className="h-12 w-12 pr-2" />
                )}
                <div className="flex flex-col">
                  <span className="text-2xl font-semibold dark:text-white">PermaplanT</span>
                  <span className="mt-auto text-xs text-gray-500 dark:text-gray-400">
                    {' '}
                    {backendVersion}
                  </span>
                </div>
              </a>
            </div>
            <div className="hidden md:flex">{auth.isAuthenticated && navbarItems}</div>
          </div>
          <div className="flex md:order-2">
            <div className="hidden items-center space-x-4 md:flex">
              <DarkModeSwitcher />
              <LanguageSwitcher />
              <LoginButton></LoginButton>
            </div>
            <IconButton
              type="button"
              className="md:hidden"
              aria-controls="navbar-sticky"
              aria-expanded="false"
              onClick={openFullPageNav}
            >
              <span className="sr-only">Open main menu</span>
              <svg aria-hidden="true" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"></path>
              </svg>
            </IconButton>
          </div>
        </div>
      </nav>
    )
  );
};

export default Navbar;
