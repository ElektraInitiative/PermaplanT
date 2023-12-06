import { MapWrapper } from '@/features/map_planning';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MemoryRouter } from 'react-router-dom';
import { Params } from 'react-router-dom';
import renderer from 'react-test-renderer';

vi.mock('react-router-dom', async () => {
  const actualRouterDom = await vi.importActual<typeof import('react-router-dom')>(
    'react-router-dom',
  );

  return {
    ...actualRouterDom,
    useParams: (): Readonly<Params> => ({ mapId: '123' }),
  };
});

vi.mock('@/utils/getUser', async () => ({
  getUser: () => ({ accessToken: '123' }),
}));

it('renders correctly', () => {
  const queryClient = new QueryClient();
  const tree = renderer
    .create(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <MapWrapper></MapWrapper>
        </MemoryRouter>
      </QueryClientProvider>,
    )
    .toJSON();
  expect(tree).toMatchSnapshot();
});
