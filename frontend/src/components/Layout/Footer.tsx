import ButtonLink from '../Button/ButtonLink';
import { useTranslation } from 'react-i18next';

/** PermaplanT Footer component */
export const Footer = () => {
  const { t } = useTranslation(['imprint']);

  return (
    <footer className="m-4 rounded-lg bg-white shadow dark:bg-neutral-800">
      <div className="mx-auto w-full max-w-screen-xl p-4 md:flex md:items-center md:justify-between">
        <span className="text-sm text-secondary-500 sm:text-center dark:text-secondary-300">
          © 2023 PermaplanT
        </span>
        <span className="text-sm text-secondary-500 sm:text-center dark:text-secondary-300">
          <a
            href="https://github.com/ElektraInitiative/PermaplanT"
            style={{ display: 'flex', alignItems: 'center', flexDirection: 'column' }}
          >
            <img
              id="home"
              src="/github-mark/github-mark-white.svg"
              alt="PermaplanT drawing"
              style={{ width: '33px', height: '33px' }}
            />
          </a>
        </span>
        <ul className="mt-3 flex flex-wrap items-center text-sm font-medium text-gray-500 sm:mt-0 dark:text-gray-400">
          <li>
            <ButtonLink className="text-sm" to="/imprint" title={t('imprint:title')} />
          </li>
        </ul>
      </div>
    </footer>
  );
};

export default Footer;
