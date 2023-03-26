import SimpleButton from '@/components/Button/SimpleButton';

export const Navbar = () => (
  <header className="flex items-center gap-10 bg-background-200-dark p-4">
    <img className="w-12" src="/permaplant-logo.svg" />
    <h2 className="text-white">PermaPlanT</h2>
    <div className="flex flex-grow justify-end gap-10">
      <a href="seeds">
        <SimpleButton>seeds</SimpleButton>
      </a>
    </div>
    <a href="https://github.com/ElektraInitiative/PermaplanT" className="w-8">
      <img src="/github-mark/github-mark-white.svg"></img>
    </a>
  </header>
);
