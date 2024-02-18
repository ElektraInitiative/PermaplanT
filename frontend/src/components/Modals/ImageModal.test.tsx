import { MemoryRouter } from 'react-router-dom';
import renderer from 'react-test-renderer';
import ImageModal from './ImageModal';

it('renders correctly', () => {
  const callback = vi.fn();
  const tree = renderer
    .create(
      <MemoryRouter>
        <ImageModal title="Test" body="Test" setShow={callback} show={true} onCancel={callback} />
      </MemoryRouter>,
    )
    .toJSON();
  expect(tree).toMatchSnapshot();
});
