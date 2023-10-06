import { ReactComponent as LogoSmallGraySVG } from '../../assets/permaplant-logo-gray.svg';
import { ReactComponent as LogoSmallSVG } from '../../assets/permaplant-logo.svg';
import { DarkModeSwitcher } from '../../features/dark_mode';
import { useDarkModeStore } from '../../features/dark_mode';
import LanguageSwitcher from '../../features/landing_page/components/LanguageSwitcher';
import { ReactComponent as CloseIcon } from '../../icons/close.svg';
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
    <nav
      className="
      fixed
      left-0
      top-0
      z-[1001]
      h-full
      w-full
      items-center
      bg-white
      dark:bg-neutral-100-dark
      "
    >
      <div className="flex flex-col gap-4 pl-4 pr-4">
        <div className="flex justify-between h-16 items-center">
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
