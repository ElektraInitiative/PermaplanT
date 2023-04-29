import { findAllMaps } from '../api/findAllMaps';
import MapCard from '../components/MapCard';
import PageTitle from '@/components/Header/PageTitle';
import Footer from '@/components/Layout/Footer';
import PageLayout from '@/components/Layout/PageLayout';
import { useInfiniteQuery } from '@tanstack/react-query';
import { Suspense } from 'react';
import { useTranslation } from 'react-i18next';

export default function MapOverview() {
  const { t } = useTranslation(['maps']);

  const { data } = useInfiniteQuery({
    queryKey: ['maps'],
    queryFn: ({ pageParam = 1 }) => findAllMaps(pageParam),
    getNextPageParam: (lastPage) => lastPage.page + 1,
  });

  const maps = data?.pages.flatMap((page) => page.results) ?? [];
  const mapList = maps.map((map) => <MapCard key={map.id} map={map} />);

  return (
    <Suspense>
      <PageLayout>
        <PageTitle title={t('maps:overview.page_title')} />
        <section className="mb-12">{mapList}</section>
        <Footer />
      </PageLayout>
    </Suspense>
  );
}
