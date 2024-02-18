import { HttpResponse, http } from 'msw';
import { server } from './setup';

export function mockServerErrorOnce(path = '*') {
  server.use(http.get(path, () => HttpResponse.error()));
}
