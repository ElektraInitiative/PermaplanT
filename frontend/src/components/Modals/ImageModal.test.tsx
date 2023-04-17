import renderer from 'react-test-renderer';
import ImageModal from './ImageModal';
import {MemoryRouter} from 'react-router-dom';

it('renders correctly', () => {
    const tree = renderer
        .create(
            <MemoryRouter>
                    <ImageModal title="Test" body="Test" setShow={() => {}} show={true} onCancel={() => {}}/>
            </MemoryRouter>
        )
        .toJSON();
    expect(tree).toMatchSnapshot();
});