import ButtonLink from '../Button/ButtonLink';
import { ReactComponent as LogoSmallGraySVG } from '@/assets/permaplant-logo-gray.svg';
import { ReactComponent as LogoSmallSVG } from '@/assets/permaplant-logo.svg';
import { DarkModeSwitcher } from '@/features/dark_mode';
import { useDarkModeStore } from '@/features/dark_mode';

/**
 * The navigation component that is fixed on the top.
 *
 */
const Navbar = () => {
  const darkMode = useDarkModeStore((state) => state.darkMode);
  return (
    // z-index 1001 is needed because of leaflet GeoMap
    <nav className="fixed top-0 left-0 z-[1001] w-full border-b-[0.5px] border-neutral-200 bg-white dark:border-neutral-700 dark:bg-neutral-100-dark">
      <div className="mx-auto flex max-w-screen-xl flex-wrap items-center justify-between p-4">
        <div className="flex space-x-16">
          <div className="flex space-x-6">
            <a href="/" className="flex items-center">
              {darkMode ? (
                <LogoSmallSVG className="h-12 w-12 pr-2" />
              ) : (
                <LogoSmallGraySVG className="h-12 w-12 pr-2" />
              )}
              <span className="self-center whitespace-nowrap text-2xl font-semibold dark:text-white">
                PermaplanT
              </span>
            </a>
          </div>
          <div
            className="hidden w-full items-center justify-between md:order-1 md:flex md:w-auto"
            id="navbar-sticky"
          >
            <ul className="mt-4 flex flex-col rounded-lg border border-gray-100 p-4 font-medium dark:border-gray-700 md:mt-0 md:flex-row md:space-x-8 md:border-0 md:p-0 ">
              <li>
                <ButtonLink title="Home" to="/" />
              </li>
              <li>
                <ButtonLink title="Seeds" to="/seeds" />
              </li>
            </ul>
          </div>
        </div>
        <div className="flex md:order-2">
          <div className="flex items-center space-x-4">
            <a href="https://github.com/ElektraInitiative/PermaplanT">GitHub</a>
            <DarkModeSwitcher />
          </div>
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
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
