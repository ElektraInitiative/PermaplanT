import ButtonLink from '../Button/ButtonLink';
import { DarkModeSwitcher } from '../../features/landing_page/components/DarkModeSwitcher';

const Navbar = () => {
  return (
    <nav className="fixed top-0 left-0 z-20 w-full border-b-[0.5px] border-gray-200 bg-white dark:border-gray-700 dark:bg-neutral-100-dark">
      <div className="mx-auto flex max-w-screen-xl flex-wrap items-center justify-between p-4">
        <div className="flex space-x-16">
          <div className="flex space-x-6">
            <a href="/" className="flex items-center">
              <span className="self-center whitespace-nowrap text-2xl font-semibold dark:text-white">
                PermaPlanT
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
          <DarkModeSwitcher />
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
