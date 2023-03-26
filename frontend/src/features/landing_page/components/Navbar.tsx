import SimpleButton, { ButtonVariant } from '@/components/Button/SimpleButton';
import { DarkModeSwitcher } from './DarkModeSwitcher';

export const Navbar = () => (
  <header className="flex items-center gap-10 bg-background-200-dark p-4">
    <img className="w-12" src="/permaplant-logo.svg" />
    <h2 className="text-white">PermaPlanT</h2>
    <div className="flex flex-grow justify-end gap-10">
      <a href="seeds">
        <SimpleButton variant={ButtonVariant.neutral}>seeds</SimpleButton>
      </a>
      <a className="border-b border-background-700" href="/#gallery">
        <SimpleButton variant={ButtonVariant.neutral}>gallery</SimpleButton>
      </a>
      <a className="border-b border-background-700" href="/#map">
        <SimpleButton variant={ButtonVariant.neutral}>map</SimpleButton>
      </a>
      <DarkModeSwitcher/>
    </div>
    <a href="https://github.com/ElektraInitiative/PermaplanT" className="w-8">
      <img src="/github-mark/github-mark-white.svg"></img>
    </a>
  </header>
);
