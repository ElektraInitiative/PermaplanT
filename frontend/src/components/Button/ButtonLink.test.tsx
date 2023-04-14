import renderer from 'react-test-renderer';
import ButtonLink from './ButtonLink';
import {MemoryRouter, MemoryRouter as Router} from 'react-router-dom';

it('renders correctly', () => {
    const tree = renderer
        .create(<MemoryRouter><ButtonLink to="https://dev.permaplant.net" title="Permaplant" /></MemoryRouter>)
        .toJSON();
    expect(tree).toMatchSnapshot();
});