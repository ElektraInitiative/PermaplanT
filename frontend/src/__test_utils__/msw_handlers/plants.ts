import { Page, PlantSpread, PlantsSummaryDto } from '@/api_types/definitions';
import { baseApiUrl } from '@/config';
import { http, HttpResponse } from 'msw';

const allPlants: PlantsSummaryDto[] = [
  {
    id: 1,
    unique_name: 'test',
    common_name_en: ['test'],
    spread: PlantSpread.Na,
  },
  {
    id: 2,
    unique_name: 'asdf',
    common_name_en: ['asdf'],
    spread: PlantSpread.Na,
  },
  {
    id: 3,
    unique_name: 'plant',
    common_name_en: ['plant'],
    spread: PlantSpread.Na,
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
];
