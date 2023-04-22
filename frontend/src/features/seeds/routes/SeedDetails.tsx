import { findPlantById } from '../api/findPlantById';
import { findSeedById } from '../api/findSeedById';
import { PlantsSummaryDto, SeedDto } from '@/bindings/definitions';
import SimpleCard from '@/components/Card/SimpleCard';
import PageTitle from '@/components/Header/PageTitle';
import PageLayout from '@/components/Layout/PageLayout';
import SimpleModal from '@/components/Modals/SimpleModal';
import { Suspense, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';

export function SeedDetails() {
  const { t } = useTranslation(['seeds', 'common']);
  const { id } = useParams();

  const [seed, setSeed] = useState<SeedDto | null>(null);
  const [plant, setPlant] = useState<PlantsSummaryDto | null>(null);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [error, setError] = useState<Error>();

  useEffect(() => {
    // fetch seed
    const _findOneSeed = async () => {
      try {
        const seed = await findSeedById(Number(id));
        setSeed(seed);

        const plant = await findPlantById(Number(seed.plant_id));
        setPlant(plant);
      } catch (error) {
        if (error instanceof Error) {
          setError(error);
          setShowErrorModal(true);
        }
      }
    };
    _findOneSeed();
  }, [id]);

  return (
    <Suspense>
      <PageLayout>
        {seed && plant && (
          <div>
            <PageTitle title={seed?.name.toString()} />
            <div className="mb-6 grid gap-8 md:grid-cols-2">
              {seed?.harvest_year && (
                <SimpleCard title={t('seeds:harvest_year')} body={seed?.harvest_year.toString()} />
              )}
              {seed?.name && (
                <SimpleCard title={t('seeds:additional_name')} body={seed?.name.toString()} />
              )}
              {plant?.unique_name && (
                <SimpleCard title={t('seeds:binomial_name')} body={plant?.unique_name} />
              )}
              {seed?.quantity && (
                <SimpleCard title={t('seeds:quantity')} body={seed?.quantity.toString()} />
              )}
              {seed?.origin && (
                <SimpleCard title={t('seeds:origin')} body={seed?.origin?.toString()} />
              )}
              {seed?.use_by && (
                <SimpleCard title={t('seeds:use_by')} body={seed?.use_by?.toString()} />
              )}
              {seed?.quality && (
                <SimpleCard title={t('seeds:quality')} body={seed?.quality?.toString()} />
              )}
              {seed?.taste && (
                <SimpleCard title={t('seeds:taste')} body={seed?.taste?.toString()} />
              )}
              {seed?.yield_ && (
                <SimpleCard title={t('seeds:yield')} body={seed?.yield_?.toString()} />
              )}
              {/* price and generation are numbers, so we can not use just && if we want to allow 0.
              see https://react.dev/learn/conditional-rendering#logical-and-operator-
            */}
              {seed?.price !== undefined && (
                <SimpleCard title={t('seeds:price')} body={seed?.price?.toString()} />
              )}
              {seed?.generation !== undefined && (
                <SimpleCard title={t('seeds:generation')} body={seed?.generation?.toString()} />
              )}
            </div>
            <div className="mb-6">
              {seed?.notes && (
                <SimpleCard title={t('seeds:notes')} body={seed?.notes?.toString()} />
              )}
            </div>
          </div>
        )}
        <SimpleModal
          title={t('seeds:error_modal_title')}
          body={error?.message || t('common:unknown_error')} // Error should always have a message
          show={showErrorModal}
          setShow={setShowErrorModal}
          submitBtnTitle={t('common:ok')}
          onSubmit={() => {
            setShowErrorModal(false);
          }}
        ></SimpleModal>
      </PageLayout>
    </Suspense>
  );
}
