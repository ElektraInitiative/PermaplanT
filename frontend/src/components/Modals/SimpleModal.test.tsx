import SimpleModal from './SimpleModal';
import { MemoryRouter } from 'react-router-dom';
import renderer from 'react-test-renderer';

it('renders correctly', () => {
  const tree = renderer
    .create(
      <MemoryRouter>
        <SimpleModal
          title="Test"
          body="Test"
          setShow={() => {}}
          show={true}
          submitBtnTitle={'Ok'}
          cancelBtnTitle={'Cancel'}
          onSubmit={() => {}}
        />
      </MemoryRouter>,
    )
    .toJSON();
  expect(tree).toMatchSnapshot();
});
