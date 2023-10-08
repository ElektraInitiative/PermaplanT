import { PlantsSummaryDto, Quantity, SeedDto } from '@/bindings/definitions';
import {
  completePlantName,
  CompletePlantNameFormatted,
  PartialPlantNameFormatted,
  partialPlantName,
} from '@/utils/plantName';
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

  expect(partialPlantName(plant)).toEqual('Brassica oleracea italica');
  expect(partialPlantName(plantWithCommonName)).toEqual(
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

  const formattedPlantName = PartialPlantNameFormatted({ plant });
  const formattedPlantNameWithCommonName = PartialPlantNameFormatted({
    plant: plantWithCommonName,
  });
  const formattedPlantNameWithCommonNameAndCultivar = PartialPlantNameFormatted({
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

  expect(completePlantName(seed, plant)).toEqual('Brassica oleracea italica - violett');
  expect(completePlantName(seed, plantWithCommonName)).toEqual(
    'Italian broccoli - violett (Brassica oleracea italica)',
  );
});

it('generates formatted plant names given plant and seed', function () {
  const seed = generateTestSeed();
  const plant = generateTestPlant();
  const plantWithCommonName = generateTestPlantWithCommonName();

  const formattedPlantName = CompletePlantNameFormatted({ seed, plant });
  const formattedPlantNameWithCommonName = CompletePlantNameFormatted({
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
