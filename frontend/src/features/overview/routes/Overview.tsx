import { useTranslation } from 'react-i18next';
import ButtonLink from '@/components/Button/ButtonLink';
import PageLayout from '@/components/Layout/PageLayout';
import { useSafeAuth } from '@/hooks/useSafeAuth';

/** In case the user is authenticated all of the available pages are listed otherwise they are prompted to log in. */
export const Overview = () => {
  const auth = useSafeAuth();
  const { t } = useTranslation(['overview', 'routes']);
  return (
    <PageLayout>
      {auth.isAuthenticated ? (
        <div className="flex flex-col">
          <ButtonLink title={t('routes:maps')} to="/maps" />
          <ButtonLink title={t('routes:seeds')} to="/seeds" />
        </div>
      ) : (
        <div>{t('overview:login_prompt')}</div>
      )}
    </PageLayout>
  );
};
