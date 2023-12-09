import { PlantSpread, PlantsSummaryDto } from '@/api_types/definitions';
import { baseApiUrl } from '@/config';
import { http, HttpResponse } from 'msw';

export const handlers = [
  http.get(`${baseApiUrl}/api/plants/:id`, ({ params }) => {
    const response: PlantsSummaryDto = {
      id: parseInt(params.id as string),
      unique_name: 'test',
      common_name_en: ['test'],
      spread: PlantSpread.Na,
    };

    return HttpResponse.json(response);
  }),
];
