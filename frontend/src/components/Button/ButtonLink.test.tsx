import { MemoryRouter } from 'react-router-dom';
import renderer from 'react-test-renderer';
import ButtonLink from './ButtonLink';

it('renders correctly', () => {
  const tree = renderer
    .create(
      <MemoryRouter>
        <ButtonLink to="https://dev.permaplant.net" title="Permaplant" />
      </MemoryRouter>,
    )
    .toJSON();
  expect(tree).toMatchSnapshot();
});
