import { createMap } from '../api/createMap';
import { findAllMaps } from '../api/findAllMaps';
import MapCard from '../components/MapCard';
import MapCreateModal from '../components/MapCreateModal';
import { NewMapDto } from '@/bindings/definitions';
import SimpleButton from '@/components/Button/SimpleButton';
import InfoMessage, { InfoMessageType } from '@/components/Card/InfoMessage';
import PageTitle from '@/components/Header/PageTitle';
import Footer from '@/components/Layout/Footer';
import PageLayout from '@/components/Layout/PageLayout';
import { useInfiniteQuery } from '@tanstack/react-query';
import { Suspense, useState } from 'react';
import { useTranslation } from 'react-i18next';

export default function MapOverview() {
  const initialMessage = {
    isSuccess: false,
    message: '',
  };

  const { t } = useTranslation(['maps']);
  const [show, setShow] = useState(false);
  const [infoMessage, setInfoMessage] = useState(initialMessage);

  const { data } = useInfiniteQuery({
    queryKey: ['maps'],
    queryFn: ({ pageParam = 1 }) => findAllMaps(1, pageParam),
    getNextPageParam: (lastPage) => lastPage.page + 1,
  });

  const maps = data?.pages.flatMap((page) => page.results) ?? [];
  const mapList = maps.map((map) => <MapCard key={map.id} map={map} />);

  function createNewMap(map: NewMapDto) {
    createMap(1, map).then(
      (newMap) => {
        mapList.push(<MapCard key={newMap.id} map={newMap} />);
        setInfoMessage({ isSuccess: true, message: t('maps:create.success') });
      },
      (error) => {
        console.error(error);
        setInfoMessage({ isSuccess: false, message: t('maps:create.failure') });
      },
    );
  }

  const infoMessageContainer = (
    <InfoMessage
      message={infoMessage.message}
      type={infoMessage.isSuccess ? InfoMessageType.success : InfoMessageType.failure}
      onClose={() => setInfoMessage({ ...infoMessage, message: '' })}
    />
  );

  return (
    <Suspense>
      <PageLayout>
        {infoMessage.message !== '' && infoMessageContainer}
        <PageTitle title={t('maps:overview.page_title')} />
        <SimpleButton
          onClick={() => setShow(true)}
          className="mb-8 max-w-[240px] grow"
          title={t('maps:overview.create_button_title')}
        >
          {t('maps:overview.create_button')}
        </SimpleButton>
        <section className="mb-12">{mapList}</section>
        <Footer />
        <MapCreateModal show={show} setShow={setShow} successCallback={createNewMap} />
      </PageLayout>
    </Suspense>
  );
}
