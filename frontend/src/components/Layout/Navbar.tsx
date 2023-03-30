import SimpleButton, { ButtonVariant } from '@/components/Button/SimpleButton';

import { DarkModeSwitcher } from '../../features/landing_page/components/DarkModeSwitcher';

export const Navbar = () => (
  <header className="flex items-center gap-10 bg-neutral-800 p-4">
    <img className="w-12" src="/permaplant-logo.svg" />
    <h2 className="text-white">PermaPlanT</h2>
    <div className="flex flex-grow justify-end gap-10">
      <a href="seeds">
        <SimpleButton variant={ButtonVariant.secondary}>seeds</SimpleButton>
      </a>
      <a className="border-b border-neutral-700" href="/#gallery">
        <SimpleButton variant={ButtonVariant.secondary}>gallery</SimpleButton>
      </a>
      <a className="border-b border-neutral-700" href="/#map">
        <SimpleButton variant={ButtonVariant.secondary}>map</SimpleButton>
      </a>
      <DarkModeSwitcher />
    </div>
    <a href="https://github.com/ElektraInitiative/PermaplanT" className="w-8">
      <img src="/github-mark/github-mark-white.svg"></img>
    </a>
  </header>
);

export const Navbar2 = () => {
  return (
    <header className="body-font text-gray-600">
      <div className="container mx-auto flex flex-col flex-wrap items-center p-5 md:flex-row">
        <a className="title-font mb-4 flex items-center font-medium text-gray-900 md:mb-0">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            className="h-10 w-10 rounded-full bg-indigo-500 p-2 text-white"
            viewBox="0 0 24 24"
          >
            <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"></path>
          </svg>
          <span className="ml-3 text-xl">PermaPlanT</span>
        </a>
        <nav className="flex flex-wrap items-center justify-center text-base md:ml-auto">
          <a className="mr-5 hover:text-gray-900">Seeds</a>
          <a className="mr-5 hover:text-gray-900">Gallery</a>
          <a className="mr-5 hover:text-gray-900">Map</a>
        </nav>
        <DarkModeSwitcher />
      </div>
    </header>
  );
};
