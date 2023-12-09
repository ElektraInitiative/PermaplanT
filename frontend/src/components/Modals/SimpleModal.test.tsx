import SimpleModal from './SimpleModal';
import { MemoryRouter } from 'react-router-dom';
import renderer from 'react-test-renderer';

it('renders correctly', () => {
  const callback = vi.fn();
  const tree = renderer
    .create(
      <MemoryRouter>
        <SimpleModal
          title="Test"
          body="Test"
          setShow={callback}
          show={true}
          submitBtnTitle={'Ok'}
          cancelBtnTitle={'Cancel'}
          onSubmit={callback}
        />
      </MemoryRouter>,
    )
    .toJSON();
  expect(tree).toMatchSnapshot();
});
