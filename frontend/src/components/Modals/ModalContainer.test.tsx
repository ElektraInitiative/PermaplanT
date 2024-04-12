import { MemoryRouter } from 'react-router-dom';
import renderer from 'react-test-renderer';
import ModalContainer from './ModalContainer';

it('renders correctly', () => {
  const tree = renderer
    .create(
      <MemoryRouter>
        <ModalContainer show={true}>content</ModalContainer>
      </MemoryRouter>,
    )
    .toJSON();
  expect(tree).toMatchSnapshot();
});
