import ButtonLink from '../Button/ButtonLink';

export const Footer = () => {
  return (
    <footer className="m-4 rounded-lg bg-white shadow dark:bg-neutral-800">
      <div className="mx-auto w-full max-w-screen-xl p-4 md:flex md:items-center md:justify-between">
        <span className="text-sm text-gray-500 dark:text-gray-400 sm:text-center">
          © 2023 PermaplanT
        </span>
        <ul className="mt-3 flex flex-wrap items-center text-sm font-medium text-gray-500 dark:text-gray-400 sm:mt-0">
          <li>
            <ButtonLink className="text-sm" to="/imprint" title="Imprint" />
          </li>
        </ul>
      </div>
    </footer>
  );
};

export default Footer;
