import { server } from './setup';
import { HttpResponse, http } from 'msw';

export function mockServerErrorOnce(path = '*') {
  server.use(http.get(path, () => HttpResponse.error()));
}
