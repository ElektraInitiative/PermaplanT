import { PlantsDto } from '../../../bindings/definitions';
import PageLayout from '../../../components/Layout/PageLayout';
import { findPlantById } from '../api/findPlantById';
import { findSeedById } from '../api/findSeedById';
import { SeedDto } from '@/bindings/definitions';
import SimpleFormInput from '@/components/Form/SimpleFormInput';
import PageTitle from '@/components/Header/PageTitle';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

('@/bindings/definitions');

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

  const currentYear = new Date().getFullYear();

  return (
    <PageLayout>
      {seed && plant && (
        <div>
          <PageTitle title={seed?.name.toString()} />
          <div className="mb-6 grid gap-8 md:grid-cols-2">
            <SimpleFormInput
              disabled={true}
              type="number"
              labelText="Harvest Year"
              value={seed?.harvest_year.toString()}
              defaultValue={currentYear}
              placeHolder={currentYear.toString()}
              required={true}
              id="harvest_year"
            />
            <SimpleFormInput
              disabled={true}
              labelText="Name"
              placeHolder="Tomato"
              value={seed?.name.toString()}
              required={true}
              id="name"
            />
            <SimpleFormInput
              disabled={true}
              id="plant_id"
              labelText="Variety"
              placeHolder="Tomato"
              value={plant?.species}
            />
            <SimpleFormInput
              disabled={true}
              id="quantity"
              labelText="Quantity"
              placeHolder="Enough"
              value={seed?.quantity.toString()}
            />
            <SimpleFormInput
              disabled={true}
              labelText="Origin"
              placeHolder="My Home"
              id="origin"
              value={seed?.origin?.toString()}
            />
            <SimpleFormInput
              disabled={true}
              type="date"
              labelText="Best by"
              placeHolder={`01.01.${currentYear}`}
              id="use_by"
              value={seed?.use_by?.toString()}
            />
            <SimpleFormInput
              disabled={true}
              labelText="Quality"
              id="quality"
              placeHolder="Good"
              value={seed?.quality?.toString()}
            />
            <SimpleFormInput
              disabled={true}
              labelText="Taste"
              placeHolder="sweet"
              id="taste"
              value={seed?.taste?.toString()}
            />
            <SimpleFormInput
              disabled={true}
              labelText="Yield"
              placeHolder="1"
              id="yield_"
              value={seed?.yield_?.toString()}
            />
            <SimpleFormInput
              disabled={true}
              labelText="Price"
              placeHolder="2,99€"
              id="price"
              value={seed?.price?.toString()}
            />
            <SimpleFormInput
              disabled={true}
              labelText="Generation"
              placeHolder="0"
              id="generation"
              value={seed?.generation?.toString()}
            />
          </div>
          <div className="mb-6">
            <SimpleFormInput
              disabled={true}
              isArea={true}
              labelText="Notes"
              placeHolder="..."
              value={seed?.notes?.toString()}
              id="notes"
            />
          </div>
        </div>
      )}
    </PageLayout>
  );
}
