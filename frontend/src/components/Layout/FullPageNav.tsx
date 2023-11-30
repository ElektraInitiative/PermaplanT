import { DarkModeSwitcher } from '../../features/dark_mode';
import { useDarkModeStore } from '../../features/dark_mode';
import LanguageSwitcher from '../../features/landing_page/components/LanguageSwitcher';
import { ReactComponent as CloseIcon } from '../../svg/icons/close.svg';
import { ReactComponent as LogoSmallGraySVG } from '../../svg/permaplant-logo-gray.svg';
import { ReactComponent as LogoSmallSVG } from '../../svg/permaplant-logo.svg';
import ButtonLink from '../Button/ButtonLink';
import IconButton from '../Button/IconButton';
import { LoginButton } from '@/features/auth/components/LoginButton';
import { useSafeAuth } from '@/hooks/useSafeAuth';
import { useTranslation } from 'react-i18next';

interface NavpageProps {
  close: () => void;
}

/**
 * The navigation component that is fixed on the top.
 *
 */
const Navpage = ({ close }: NavpageProps) => {
  const darkMode = useDarkModeStore((state) => state.darkMode);
  const { t } = useTranslation(['routes']);
  const auth = useSafeAuth();
  const backendVersion = sessionStorage.getItem('backend_version');
  const navbarItems = (
    <ul className="flex flex-col items-center gap-4 pt-1">
      <li className="text-center">
        <ButtonLink
          onClick={close}
          title={t('routes:maps')}
          to="/maps"
          className="text-lg font-medium"
        />
      </li>
      <li>
        <ButtonLink
          onClick={close}
          title={t('routes:seeds')}
          to="/seeds"
          className="text-lg font-medium"
        />
      </li>
    </ul>
  );

  return (
    // z-index 1001 is needed because of leaflet GeoMap
    <nav
      className="
      fixed
      left-0
      top-0
      z-[1001]
      h-full
      w-screen
      items-center
      bg-white
      dark:bg-neutral-100-dark
      "
    >
      <div className="flex flex-col gap-4 px-4">
        <div className="flex h-16 items-center justify-between">
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
          <IconButton onClick={close}>
            <CloseIcon></CloseIcon>
          </IconButton>
        </div>
        <ul>{auth.isAuthenticated && navbarItems}</ul>
        <div className="h-[3px] w-full bg-neutral-700" />
        <div className="flex items-center justify-center gap-4">
          <DarkModeSwitcher />
          <LanguageSwitcher />
        </div>
        <LoginButton></LoginButton>
      </div>
    </nav>
  );
};

export default Navpage;
