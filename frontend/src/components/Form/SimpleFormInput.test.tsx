import { MemoryRouter } from 'react-router-dom';
import renderer from 'react-test-renderer';
import SimpleFormInput from './SimpleFormInput';

it('renders correctly', () => {
  const tree = renderer
    .create(
      <MemoryRouter>
        <SimpleFormInput id="test" labelContent="Some Label" />
      </MemoryRouter>,
    )
    .toJSON();
  expect(tree).toMatchSnapshot();
});
