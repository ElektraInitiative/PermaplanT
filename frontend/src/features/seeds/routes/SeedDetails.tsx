import { PlantsDto } from '../../../bindings/definitions';
import PageLayout from '../../../components/Layout/PageLayout';
import { findPlantById } from '../api/findPlantById';
import { findSeedById } from '../api/findSeedById';
import { SeedDto } from '@/bindings/definitions';
import SimpleCard from '@/components/Card/SimpleCard';
import PageTitle from '@/components/Header/PageTitle';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

export function SeedDetails() {
  const { id } = useParams();

  const [seed, setSeed] = useState<SeedDto | null>(null);
  const [plant, setPlant] = useState<PlantsDto | null>(null);

  useEffect(() => {
    // fetch seed
    const _findOneSeed = async () => {
      const seed = await findSeedById(Number(id));
      setSeed(seed);

      const plant = await findPlantById(Number(seed.plant_id));
      setPlant(plant);
    };
    _findOneSeed();
  }, []);

  return (
    <PageLayout>
      {seed && plant && (
        <div>
          <PageTitle title={seed?.name.toString()} />
          <div className="mb-6 grid gap-8 md:grid-cols-2">
            {seed?.harvest_year && (
              <SimpleCard title="Harvest Year" body={seed?.harvest_year.toString()} />
            )}
            {seed?.name && <SimpleCard title="Name" body={seed?.name.toString()} />}
            {plant?.species && <SimpleCard title="Variety" body={plant?.species} />}
            {seed?.quantity && <SimpleCard title="Quantity" body={seed?.quantity.toString()} />}
            {seed?.origin && <SimpleCard title="Origin" body={seed?.origin?.toString()} />}
            {seed?.use_by && <SimpleCard title="Best by" body={seed?.use_by?.toString()} />}
            {seed?.quality && <SimpleCard title="Quality" body={seed?.quality?.toString()} />}
            {seed?.taste && <SimpleCard title="Taste" body={seed?.taste?.toString()} />}
            {seed?.yield_ && <SimpleCard title="Yield" body={seed?.yield_?.toString()} />}
            {seed?.price && <SimpleCard title="Price" body={seed?.price?.toString()} />}
            {seed?.generation && (
              <SimpleCard title="Generation" body={seed?.generation?.toString()} />
            )}
          </div>
          <div className="mb-6">
            {seed?.notes && <SimpleCard title="Generation" body={seed?.notes?.toString()} />}
          </div>
        </div>
      )}
    </PageLayout>
  );
}
