import renderer from 'react-test-renderer';
import SearchInput from './SearchInput';
import {MemoryRouter, MemoryRouter as Router} from 'react-router-dom';

it('renders correctly', () => {
    const tree = renderer
        .create(<MemoryRouter><SearchInput placeholder='Test' handleSearch={() => {}}/></MemoryRouter>)
        .toJSON();
    expect(tree).toMatchSnapshot();
});