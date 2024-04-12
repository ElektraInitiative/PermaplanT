import { MemoryRouter } from 'react-router-dom';
import renderer from 'react-test-renderer';
import PageTitle from './PageTitle';

it('renders correctly', () => {
  const tree = renderer
    .create(
      <MemoryRouter>
        <PageTitle title={'Hello World!'} />
      </MemoryRouter>,
    )
    .toJSON();
  expect(tree).toMatchSnapshot();
});
