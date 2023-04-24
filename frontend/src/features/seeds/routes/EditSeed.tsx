import { findSeedById } from '../api/findSeedById';
import CreateSeedForm from '../components/CreateSeedForm';
import { NewSeedDto, SeedDto } from '@/bindings/definitions';
import PageTitle from '@/components/Header/PageTitle';
import PageLayout from '@/components/Layout/PageLayout';
import { t } from 'i18next';
import { Suspense, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

export function EditSeed() {
  const { id } = useParams();

  const [seed, setSeed] = useState<SeedDto | null>(null);

  useEffect(() => {
    // fetch seed
    const _findOneSeed = async () => {
      try {
        const seed = await findSeedById(Number(id));
        setSeed(seed);
      } catch (error) {}
    };
    _findOneSeed();
  }, [id]);

  return (
    <Suspense>
      <PageLayout>
        <PageTitle title={t('seeds:create_seed.title')} />
        <CreateSeedForm
          isUploadingSeed={false}
          existingSeed={seed ? seed : undefined}
          onCancel={() => {}}
          onChange={() => {}}
          onSubmit={(data: NewSeedDto) => {
            // edit seed
            console.log('hel');
          }}
        />
      </PageLayout>
    </Suspense>
  );
}
