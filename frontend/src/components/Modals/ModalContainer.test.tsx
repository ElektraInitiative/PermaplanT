import renderer from 'react-test-renderer';
import ModalContainer from './ModalContainer';
import {MemoryRouter} from 'react-router-dom';

it('renders correctly', () => {
    const tree = renderer
        .create(
            <MemoryRouter>
                    <ModalContainer children={[]} show={true} />
            </MemoryRouter>
        )
        .toJSON();
    expect(tree).toMatchSnapshot();
});