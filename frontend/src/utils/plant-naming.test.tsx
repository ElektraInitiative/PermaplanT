import ReactTestRenderer from 'react-test-renderer';
import { PlantsSummaryDto, Quantity, SeedDto } from '@/api_types/definitions';
import {
  getCommonName,
  getCommonOrUniqueName,
  getNameFromPlant,
  getPlantNameFromAdditionalNameAndPlant,
  getPlantNameFromSeedAndPlant,
  PlantNameFromAdditionalNameAndPlant,
  PlantNameFromPlant,
  PlantNameFromSeedAndPlant,
} from '@/utils/plant-naming';

it('generates the english common name', function () {
  const plant: PlantsSummaryDto = {
    id: 1,
    unique_name: 'Brassica oleracea italica',
    common_name_en: ['Broccoli'],
    common_name_de: ['Brokkoli'],
  };

  expect(getCommonName(plant, 'en')).toEqual('Broccoli');
});

it('generates the german common name', function () {
  const plant: PlantsSummaryDto = {
    id: 1,
    unique_name: 'Brassica oleracea italica',
    common_name_en: ['Broccoli'],
    common_name_de: ['Brokkoli'],
  };

  expect(getCommonName(plant, 'de')).toEqual('Brokkoli');
});

it('generates the english name (fallback from german)', function () {
  const plant: PlantsSummaryDto = {
    id: 1,
    unique_name: 'Brassica oleracea italica',
    common_name_en: ['Broccoli'],
    common_name_de: [''],
  };

  expect(getCommonName(plant, 'de')).toEqual('Broccoli');
});

it('generates an empty name', function () {
  const plant: PlantsSummaryDto = {
    id: 1,
    unique_name: 'Brassica oleracea italica',
    common_name_en: [''],
    common_name_de: ['Brokkoli'],
  };

  expect(getCommonName(plant, 'en')).toEqual('');
});

it('generates the english common name', function () {
  const plant: PlantsSummaryDto = {
    id: 1,
    unique_name: 'Brassica oleracea italica',
    common_name_en: ['Broccoli'],
    common_name_de: ['Brokkoli'],
  };

  expect(getCommonOrUniqueName(plant, 'en')).toEqual('Broccoli');
});

it('generates the german common name', function () {
  const plant: PlantsSummaryDto = {
    id: 1,
    unique_name: 'Brassica oleracea italica',
    common_name_en: ['Broccoli'],
    common_name_de: ['Brokkoli'],
  };

  expect(getCommonOrUniqueName(plant, 'de')).toEqual('Brokkoli');
});

it('generates the english name (fallback from german)', function () {
  const plant: PlantsSummaryDto = {
    id: 1,
    unique_name: 'Brassica oleracea italica',
    common_name_en: ['Broccoli'],
    common_name_de: [''],
  };

  expect(getCommonOrUniqueName(plant, 'de')).toEqual('Broccoli');
});

it('generates the unique name as a fallback', function () {
  const plant: PlantsSummaryDto = {
    id: 1,
    unique_name: 'Brassica oleracea italica',
    common_name_en: [''],
    common_name_de: ['Brokkoli'],
  };

  expect(getCommonOrUniqueName(plant, 'en')).toEqual('Brassica oleracea italica');
});

it('generates unique name', function () {
  const plant: PlantsSummaryDto = {
    id: 1,
    unique_name: 'Brassica oleracea italica',
    common_name_en: [],
  };

  expect(getNameFromPlant(plant, 'en')).toEqual('Brassica oleracea italica');
});

it('generates a plant name without additional name', function () {
  const plant: PlantsSummaryDto = {
    id: 1,
    unique_name: 'Brassica oleracea italica',
    common_name_en: ['Italian broccoli'],
  };

  expect(getNameFromPlant(plant, 'en')).toEqual('Italian broccoli (Brassica oleracea italica)');
});

it('generates formatted unique name', function () {
  const plant: PlantsSummaryDto = {
    id: 1,
    unique_name: 'Brassica oleracea italica',
    common_name_en: [],
  };

  expect(ReactTestRenderer.create(PlantNameFromPlant({ plant, language: 'en' })).toJSON()).toEqual(
    ReactTestRenderer.create(<i>Brassica oleracea italica</i>).toJSON(),
  );
});

it('generates formated plant name without additional name', function () {
  const plant: PlantsSummaryDto = {
    id: 1,
    unique_name: 'Brassica oleracea italica',
    common_name_en: ['italian broccoli'],
  };

  expect(ReactTestRenderer.create(PlantNameFromPlant({ plant, language: 'en' })).toJSON()).toEqual(
    ReactTestRenderer.create(
      <>
        <>Italian broccoli</> (<i>Brassica oleracea italica</i>)
      </>,
    ).toJSON(),
  );
});

it('generates plant name with cultivar', function () {
  const plant: PlantsSummaryDto = {
    id: 1,
    unique_name: "Brassica oleracea italica 'Ramoso calabrese'",
    common_name_en: ['italian broccoli'],
  };

  expect(ReactTestRenderer.create(PlantNameFromPlant({ plant, language: 'en' })).toJSON()).toEqual(
    ReactTestRenderer.create(
      <>
        <>Italian broccoli</> (<i>Brassica oleracea italica</i>
        <> &apos;Ramoso calabrese&apos;</>)
      </>,
    ).toJSON(),
  );
});

it('generates complete plant name without common name', function () {
  const plant: PlantsSummaryDto = {
    id: 1,
    unique_name: 'Brassica oleracea italica',
    common_name_en: [],
  };

  const seed = generateTestSeed('violett');

  expect(getPlantNameFromSeedAndPlant(seed, plant, 'en')).toEqual(
    'Brassica oleracea italica - violett',
  );
});

it('generates complete plant name without common name', function () {
  const plant: PlantsSummaryDto = {
    id: 1,
    unique_name: 'Brassica oleracea italica',
    common_name_en: [],
  };

  const additionalName = 'violett';

  expect(getPlantNameFromAdditionalNameAndPlant(additionalName, plant, 'en')).toEqual(
    'Brassica oleracea italica - violett',
  );
});

it('generates a complete plant name', function () {
  const plant: PlantsSummaryDto = {
    id: 1,
    unique_name: 'Brassica oleracea italica',
    common_name_en: ['italian broccoli'],
  };

  const seed = generateTestSeed('violett');

  expect(getPlantNameFromSeedAndPlant(seed, plant, 'en')).toEqual(
    'Italian broccoli - violett (Brassica oleracea italica)',
  );
});

it('generates complete plant name', function () {
  const plant: PlantsSummaryDto = {
    id: 1,
    unique_name: 'Brassica oleracea italica',
    common_name_en: ['italian broccoli'],
  };

  const additionalName = 'violett';

  expect(getPlantNameFromAdditionalNameAndPlant(additionalName, plant, 'en')).toEqual(
    'Italian broccoli - violett (Brassica oleracea italica)',
  );
});

it('generates formatted unique name', function () {
  const plant: PlantsSummaryDto = {
    id: 1,
    unique_name: 'Brassica oleracea italica',
    common_name_en: [],
  };

  const seed = generateTestSeed('violett');

  expect(
    ReactTestRenderer.create(PlantNameFromSeedAndPlant({ seed, plant, language: 'en' })).toJSON(),
  ).toEqual(
    ReactTestRenderer.create(
      <>
        <i>Brassica oleracea italica</i> - <>violett</>
      </>,
    ).toJSON(),
  );
});

it('generates a formatted plant name', function () {
  const plant: PlantsSummaryDto = {
    id: 1,
    unique_name: 'Brassica oleracea italica',
    common_name_en: ['italian broccoli'],
  };

  const seed = generateTestSeed('violett');

  expect(
    ReactTestRenderer.create(PlantNameFromSeedAndPlant({ seed, plant, language: 'en' })).toJSON(),
  ).toEqual(
    ReactTestRenderer.create(
      <>
        <>Italian broccoli</> - <>violett</> (<i>Brassica oleracea italica</i>)
      </>,
    ).toJSON(),
  );
});

it('generates formatted unique name', function () {
  const plant: PlantsSummaryDto = {
    id: 1,
    unique_name: 'Brassica oleracea italica',
    common_name_en: [],
  };

  const additionalName = 'violett';

  expect(
    ReactTestRenderer.create(
      PlantNameFromAdditionalNameAndPlant({ additionalName, plant, language: 'en' }),
    ).toJSON(),
  ).toEqual(
    ReactTestRenderer.create(
      <>
        <i>Brassica oleracea italica</i> - <>violett</>
      </>,
    ).toJSON(),
  );
});

it('generates a formatted plant name', function () {
  const plant: PlantsSummaryDto = {
    id: 1,
    unique_name: 'Brassica oleracea italica',
    common_name_en: ['italian broccoli'],
  };

  const additionalName = 'violett';

  expect(
    ReactTestRenderer.create(
      PlantNameFromAdditionalNameAndPlant({ additionalName, plant, language: 'en' }),
    ).toJSON(),
  ).toEqual(
    ReactTestRenderer.create(
      <>
        <>Italian broccoli</> - <>violett</> (<i>Brassica oleracea italica</i>)
      </>,
    ).toJSON(),
  );
});

function generateTestSeed(seed_name: string): SeedDto {
  return {
    id: 1,
    plant_id: 1,
    name: seed_name,
    harvest_year: 2022,
    quantity: Quantity.Enough,
    owner_id: '00000000-0000-0000-0000-000000000000',
  };
}
