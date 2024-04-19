import { http, HttpResponse } from 'msw';
import {
  Page,
  PlantsSummaryDto,
  RelationDto,
  RelationsDto,
  RelationType,
} from '@/api_types/definitions';
import { baseApiUrl } from '@/config';

const allPlants: PlantsSummaryDto[] = [
  {
    id: 1,
    unique_name: 'test',
    common_name_en: ['test'],
  },
  {
    id: 2,
    unique_name: 'asdf',
    common_name_en: ['asdf'],
  },
  {
    id: 3,
    unique_name: 'plant',
    common_name_en: ['plant'],
  },
];

const allRelationPartners: RelationDto[] = [
  {
    id: 1,
    relation: RelationType.Neutral,
  },
  {
    id: 2,
    relation: RelationType.Antagonist,
  },
];

const allRelations: RelationsDto[] = [
  {
    id: 1,
    relations: [allRelationPartners[0], allRelationPartners[1]],
  },
];

export const handlers = [
  http.get(`${baseApiUrl}/api/plants/:id`, () => {
    return HttpResponse.json(allPlants[0]);
  }),

  http.get(`${baseApiUrl}/api/plants`, ({ request }) => {
    const url = new URL(request.url);

    const searchTerm = url.searchParams.get('name');
    const page = url.searchParams.get('page');

    const response: Page<PlantsSummaryDto> = {
      page: parseInt(page as string),
      per_page: 30,
      total_pages: 1,
      results: allPlants.filter((plant) => plant.unique_name.includes(searchTerm as string)),
    };

    return HttpResponse.json(response);
  }),

  http.get(`${baseApiUrl}/api/:mapId/1/layers/plants/relations`, ({ request }) => {
    const url = new URL(request.url);

    const plantId = parseInt(url.searchParams.get('plant_id') ?? '-1');
    return HttpResponse.json(allRelations[plantId - 1]);
  }),
];

export const allPlantsForTesting = allPlants;
