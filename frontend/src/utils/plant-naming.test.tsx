import { PlantsSummaryDto, Quantity, SeedDto } from '@/bindings/definitions';
import {
  getPlantNameFromSeedAndPlant,
  PlantNameFromSeedAndPlant,
  PlantNameFromPlant,
  getNameFromPlant,
  hasCommonName,
  commonNameToUppercase,
} from '@/utils/plant-naming';
import ReactTestRenderer from 'react-test-renderer';

function generateTestSeed(): SeedDto {
  return {
    id: 1,
    plant_id: 1,
    name: 'violett',
    harvest_year: 2022,
    quantity: Quantity.Enough,
    owner_id: '00000000-0000-0000-0000-000000000000',
  };
}

function generateTestPlant(): PlantsSummaryDto {
  return {
    id: 1,
    unique_name: 'Brassica oleracea italica',
    common_name_en: [],
  };
}

function generateTestPlantWithCommonName(): PlantsSummaryDto {
  return {
    id: 1,
    unique_name: 'Brassica oleracea italica',
    common_name_en: ['italian broccoli'],
  };
}

it('generates plant names given a plant', function () {
  const plant = generateTestPlant();
  const plantWithCommonName = generateTestPlantWithCommonName();

  expect(getNameFromPlant(plant)).toEqual('Brassica oleracea italica');
  expect(getNameFromPlant(plantWithCommonName)).toEqual(
    'Italian broccoli (Brassica oleracea italica)',
  );
});

it('generates formatted plant names given a plant', function () {
  const plant = generateTestPlant();
  const plantWithCommonName = generateTestPlantWithCommonName();
  const plantWithCommonNameAndCultivar: PlantsSummaryDto = {
    id: 1,
    unique_name: "Brassica oleracea italica 'Ramoso calabrese'",
    common_name_en: ['italian broccoli'],
  };

  const formattedPlantName = PlantNameFromPlant({ plant });
  const formattedPlantNameWithCommonName = PlantNameFromPlant({
    plant: plantWithCommonName,
  });
  const formattedPlantNameWithCommonNameAndCultivar = PlantNameFromPlant({
    plant: plantWithCommonNameAndCultivar,
  });

  expect(ReactTestRenderer.create(formattedPlantName).toJSON()).toEqual(
    ReactTestRenderer.create(<i>Brassica oleracea italica</i>).toJSON(),
  );

  expect(ReactTestRenderer.create(formattedPlantNameWithCommonName).toJSON()).toEqual(
    ReactTestRenderer.create(
      <>
        <>Italian broccoli</> (<i>Brassica oleracea italica</i>)
      </>,
    ).toJSON(),
  );

  expect(ReactTestRenderer.create(formattedPlantNameWithCommonNameAndCultivar).toJSON()).toEqual(
    ReactTestRenderer.create(
      <>
        <>Italian broccoli</> (<i>Brassica oleracea italica</i>
        <> &apos;Ramoso calabrese&apos;</>)
      </>,
    ).toJSON(),
  );
});

it('generates plant names given plant and seed', function () {
  const seed = generateTestSeed();
  const plant = generateTestPlant();
  const plantWithCommonName = generateTestPlantWithCommonName();

  expect(getPlantNameFromSeedAndPlant(seed, plant)).toEqual('Brassica oleracea italica - violett');
  expect(getPlantNameFromSeedAndPlant(seed, plantWithCommonName)).toEqual(
    'Italian broccoli - violett (Brassica oleracea italica)',
  );
});

it('generatess formatted plant names given plant and seed', function () {
  const seed = generateTestSeed();
  const plant = generateTestPlant();
  const plantWithCommonName = generateTestPlantWithCommonName();

  const formattedPlantName = PlantNameFromSeedAndPlant({ seed, plant });
  const formattedPlantNameWithCommonName = PlantNameFromSeedAndPlant({
    seed,
    plant: plantWithCommonName,
  });

  expect(ReactTestRenderer.create(formattedPlantName).toJSON()).toEqual(
    ReactTestRenderer.create(
      <>
        <i>Brassica oleracea italica</i> - <>violett</>
      </>,
    ).toJSON(),
  );

  expect(ReactTestRenderer.create(formattedPlantNameWithCommonName).toJSON()).toEqual(
    ReactTestRenderer.create(
      <>
        <>Italian broccoli</> - <>violett</> (<i>Brassica oleracea italica</i>)
      </>,
    ).toJSON(),
  );
});

it('checks if a plant has a common name', function () {
  const plant = generateTestPlant();
  const plantWithCommonName = generateTestPlantWithCommonName();

  expect(hasCommonName(plant)).toBe(false);
  expect(hasCommonName(plantWithCommonName)).toBe(true);
});

it('capitalizes the first letter of a common name', function () {
  const plant = generateTestPlant();
  const plantWithCommonName = generateTestPlantWithCommonName();

  expect(commonNameToUppercase(plant.common_name_en)).toBe(undefined);
  expect(commonNameToUppercase(plantWithCommonName.common_name_en)).toBe('Italian broccoli');
});
