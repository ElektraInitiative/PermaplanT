import ButtonLink from '@/components/Button/ButtonLink';
import PageLayout from '@/components/Layout/PageLayout';
import { useSafeAuth } from '@/hooks/useSafeAuth';
import { useTranslation } from 'react-i18next';

/** In case the user is authenticated all the available pages are listed otherwise they are prompted to log in. */
export const Overview = () => {
  const auth = useSafeAuth();
  const { t } = useTranslation(['overview']);
  return (
    <PageLayout>
      {auth.isAuthenticated ? (
        <div className="flex flex-col">
          <ButtonLink title="Maps" to="/maps" />
          <ButtonLink title="Seeds" to="/seeds" />
        </div>
      ) : (
        <div>{t('overview:login_prompt')}</div>
      )}
    </PageLayout>
  );
};
