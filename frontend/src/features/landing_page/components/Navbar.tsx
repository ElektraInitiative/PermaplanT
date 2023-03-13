export const Navbar = () => (
  <header className="flex items-center gap-10 bg-stone-900 p-4">
    <img className="w-12" src="/permaplant-logo.svg" />
    <h2 className="text-white">PermaPlanT</h2>
    <div className="flex flex-grow justify-end gap-10">
      <a className="btn" href="seeds">
        seeds
      </a>
    </div>
    <a href="https://github.com/ElektraInitiative/PermaplanT" className="w-8">
      <img src="/github-mark/github-mark-white.svg"></img>
    </a>
  </header>
);
