import { createMap } from '../api/createMap';
import { findAllMaps } from '../api/findAllMaps';
import MapCard from '../components/MapCard';
import { MapDto, MapSearchParameters, NewMapDto } from '@/api_types/definitions';
import SimpleButton from '@/components/Button/SimpleButton';
import InfoMessage, { InfoMessageType } from '@/components/Card/InfoMessage';
import PageTitle from '@/components/Header/PageTitle';
import Footer from '@/components/Layout/Footer';
import PageLayout from '@/components/Layout/PageLayout';
import { errorToastGrouped } from '@/features/toasts/groupedToast';
import { useSafeAuth } from '@/hooks/useSafeAuth';
import { useInfiniteQuery } from '@tanstack/react-query';
import { Suspense, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

export default function MapOverview() {
  const initialMessage = {
    isSuccess: false,
    message: '',
  };

  const { user } = useSafeAuth();
  const navigate = useNavigate();
  const { t } = useTranslation(['maps']);
  const [infoMessage, setInfoMessage] = useState(initialMessage);

  const searchParams: MapSearchParameters = {
    owner_id: user?.profile.sub,
  };

  const { data, error } = useInfiniteQuery({
    queryKey: ['maps', searchParams] as const,
    queryFn: ({ pageParam = 1, queryKey: [, params] }) => findAllMaps(pageParam, params),
    getNextPageParam: (lastPage) => lastPage.page + 1,
  });

  if (error) {
    console.error(error);
    errorToastGrouped(t('maps:overview.error_map_fetch'), { autoClose: false });
  }

  const maps = data?.pages.flatMap((page) => page.results) ?? [];
  const mapList = maps.map((map) => <MapCard key={map.id} map={map} onDuplicate={duplicateMap} />);

  const infoMessageContainer = (
    <InfoMessage
      message={infoMessage.message}
      type={infoMessage.isSuccess ? InfoMessageType.success : InfoMessageType.failure}
      onClose={() => setInfoMessage({ ...infoMessage, message: '' })}
    />
  );

  async function duplicateMap(targetMap: MapDto) {
    const copyNumber = maps.filter(
      (map) =>
        map.name.replace(/ \([0123456789]+\)$/, '') ===
        targetMap.name.replace(/ \([0123456789]+\)$/, ''),
    ).length;
    const mapCopy: NewMapDto = {
      name: `${targetMap.name.replace(/ \([0123456789]+\)$/, '')} (${copyNumber})`,
      creation_date: new Date().toISOString().split('T')[0],
      deletion_date: targetMap.deletion_date,
      last_visit: targetMap.last_visit,
      is_inactive: targetMap.is_inactive,
      zoom_factor: targetMap.zoom_factor,
      honors: targetMap.honors,
      visits: targetMap.visits,
      harvested: targetMap.harvested,
      privacy: targetMap.privacy,
      description: targetMap.description,
      location: targetMap.location,
      geometry: targetMap.geometry,
    };

    await createMap(mapCopy);
    navigate(0);
  }

  return (
    <Suspense>
      <PageLayout>
        {infoMessage.message !== '' && infoMessageContainer}
        <PageTitle title={t('maps:overview.page_title')} />
        <SimpleButton
          onClick={() => navigate('/maps/create')}
          className="mb-8 max-w-[240px] grow"
          title={t('maps:overview.create_button_title')}
        >
          {t('maps:overview.create_button')}
        </SimpleButton>
        <section className="mb-12">{mapList}</section>
        <Footer />
      </PageLayout>
    </Suspense>
  );
}
