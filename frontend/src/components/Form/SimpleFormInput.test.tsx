import renderer from 'react-test-renderer';
import SimpleFormInput from './SimpleFormInput';
import {MemoryRouter} from 'react-router-dom';

it('renders correctly', () => {
    const tree = renderer
        .create(
            <MemoryRouter>
                    <SimpleFormInput id="test" labelText="Some Label" />
            </MemoryRouter>
        )
        .toJSON();
    expect(tree).toMatchSnapshot();
});