import { MemoryRouter } from 'react-router-dom';
import renderer from 'react-test-renderer';
import SimpleCard from './SimpleCard';

it('renders correctly', () => {
  const tree = renderer
    .create(
      <MemoryRouter>
        <SimpleCard title="Permaplant" body="This is a test." />
      </MemoryRouter>,
    )
    .toJSON();
  expect(tree).toMatchSnapshot();
});
