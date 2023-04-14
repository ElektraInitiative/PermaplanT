import renderer from 'react-test-renderer';
import SimpleCard from './SimpleCard';
import {MemoryRouter, MemoryRouter as Router} from 'react-router-dom';

it('renders correctly', () => {
    const tree = renderer
        .create(<MemoryRouter><SimpleCard title="Permaplant" body="This is a test." /></MemoryRouter>)
        .toJSON();
    expect(tree).toMatchSnapshot();
});