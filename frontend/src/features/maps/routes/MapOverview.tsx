import PageTitle from '@/components/Header/PageTitle';
import PageLayout from '@/components/Layout/PageLayout';
import { Suspense } from 'react';
import { useTranslation } from 'react-i18next';

export default function MapOverview() {
  const { t } = useTranslation(['maps']);

  return (
    <Suspense>
      <PageLayout>
        <PageTitle title={t('maps:overview.page_title')} />
      </PageLayout>
    </Suspense>
  );
}
