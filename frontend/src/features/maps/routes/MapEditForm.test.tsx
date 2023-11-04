import MapEditForm from '@/features/maps/routes/MapEditForm';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MemoryRouter } from 'react-router-dom';
import renderer from 'react-test-renderer';

it('renders correctly', () => {
  const queryClient = new QueryClient();
  const tree = renderer
    .create(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <MapEditForm></MapEditForm>
        </MemoryRouter>
      </QueryClientProvider>,
    )
    .toJSON();
  expect(tree).toMatchSnapshot();
});
