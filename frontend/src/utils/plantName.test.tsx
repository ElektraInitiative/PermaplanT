import { PlantsSummaryDto, Quantity, SeedDto } from '@/bindings/definitions';
import {
  completePlantName,
  CompletePlantNameFormatted,
  PartialPlantNameFormatted,
  partialPlantName,
} from '@/utils/plantName';
import ReactTestRenderer from 'react-test-renderer';

it('should generate unique name', function () {
  const plant: PlantsSummaryDto = {
    id: 1,
    unique_name: 'Brassica oleracea italica',
    common_name_en: [],
  };

  expect(partialPlantName(plant)).toEqual('Brassica oleracea italica');
});

it('should generate a partial name', function () {
  const plant: PlantsSummaryDto = {
    id: 1,
    unique_name: 'Brassica oleracea italica',
    common_name_en: ['Italian broccoli'],
  };

  expect(partialPlantName(plant)).toEqual('Italian broccoli (Brassica oleracea italica)');
});

it('should generate formatted unique name', function () {
  const plant: PlantsSummaryDto = {
    id: 1,
    unique_name: 'Brassica oleracea italica',
    common_name_en: [],
  };

  expect(ReactTestRenderer.create(PartialPlantNameFormatted({ plant })).toJSON()).toEqual(
    ReactTestRenderer.create(<i>Brassica oleracea italica</i>).toJSON(),
  );
});

it('should generate a formatted partial name', function () {
  const plant: PlantsSummaryDto = {
    id: 1,
    unique_name: 'Brassica oleracea italica',
    common_name_en: ['italian broccoli'],
  };

  expect(ReactTestRenderer.create(PartialPlantNameFormatted({ plant })).toJSON()).toEqual(
    ReactTestRenderer.create(
      <>
        <>Italian broccoli</> (<i>Brassica oleracea italica</i>)
      </>,
    ).toJSON(),
  );
});

it('should generate a correctly formatted partial name', function () {
  const plant: PlantsSummaryDto = {
    id: 1,
    unique_name: "Brassica oleracea italica 'Ramoso calabrese'",
    common_name_en: ['italian broccoli'],
  };

  expect(ReactTestRenderer.create(PartialPlantNameFormatted({ plant })).toJSON()).toEqual(
    ReactTestRenderer.create(
      <>
        <>Italian broccoli</> (<i>Brassica oleracea italica</i>
        <> &apos;Ramoso calabrese&apos;</>)
      </>,
    ).toJSON(),
  );
});

it('should generate unique and additional name', function () {
  const plant: PlantsSummaryDto = {
    id: 1,
    unique_name: 'Brassica oleracea italica',
    common_name_en: [],
  };

  const seed: SeedDto = {
    id: 1,
    plant_id: 1,
    name: 'violett',
    harvest_year: 2022,
    quantity: Quantity.Enough,
    owner_id: '00000000-0000-0000-0000-000000000000',
  };

  expect(completePlantName(seed, plant)).toEqual('Brassica oleracea italica - violett');
});

it('should generate a partial name', function () {
  const plant: PlantsSummaryDto = {
    id: 1,
    unique_name: 'Brassica oleracea italica',
    common_name_en: ['italian broccoli'],
  };

  const seed: SeedDto = {
    id: 1,
    plant_id: 1,
    name: 'violett',
    harvest_year: 2022,
    quantity: Quantity.Enough,
    owner_id: '00000000-0000-0000-0000-000000000000',
  };

  expect(completePlantName(seed, plant)).toEqual(
    'Italian broccoli - violett (Brassica oleracea italica)',
  );
});

it('should generate formatted unique name', function () {
  const plant: PlantsSummaryDto = {
    id: 1,
    unique_name: 'Brassica oleracea italica',
    common_name_en: [],
  };

  const seed: SeedDto = {
    id: 1,
    plant_id: 1,
    name: 'violett',
    harvest_year: 2022,
    quantity: Quantity.Enough,
    owner_id: '00000000-0000-0000-0000-000000000000',
  };

  expect(ReactTestRenderer.create(CompletePlantNameFormatted({ seed, plant })).toJSON()).toEqual(
    ReactTestRenderer.create(
      <>
        <i>Brassica oleracea italica</i> - <>violett</>
      </>,
    ).toJSON(),
  );
});

it('should generate a formatted partial name', function () {
  const plant: PlantsSummaryDto = {
    id: 1,
    unique_name: 'Brassica oleracea italica',
    common_name_en: ['italian broccoli'],
  };

  const seed: SeedDto = {
    id: 1,
    plant_id: 1,
    name: 'violett',
    harvest_year: 2022,
    quantity: Quantity.Enough,
    owner_id: '00000000-0000-0000-0000-000000000000',
  };

  expect(ReactTestRenderer.create(CompletePlantNameFormatted({ seed, plant })).toJSON()).toEqual(
    ReactTestRenderer.create(
      <>
        <>Italian broccoli</> - <>violett</> (<i>Brassica oleracea italica</i>)
      </>,
    ).toJSON(),
  );
});
