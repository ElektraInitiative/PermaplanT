import SimpleFormInputArea from './SimpleFormInputArea';
import { MemoryRouter } from 'react-router-dom';
import renderer from 'react-test-renderer';

it('renders correctly', () => {
  const tree = renderer
    .create(
      <MemoryRouter>
        <SimpleFormInputArea id="test" labelText="Some Label" />
      </MemoryRouter>,
    )
    .toJSON();
  expect(tree).toMatchSnapshot();
});
