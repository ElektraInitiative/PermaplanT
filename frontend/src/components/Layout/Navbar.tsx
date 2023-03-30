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
