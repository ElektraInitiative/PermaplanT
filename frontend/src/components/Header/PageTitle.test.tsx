import renderer from 'react-test-renderer';
import PageTitle from './PageTitle';
import {MemoryRouter} from 'react-router-dom';

it('renders correctly', () => {
    const tree = renderer
        .create(
            <MemoryRouter>
                    <PageTitle title={"Hello World!"} />
            </MemoryRouter>
        )
        .toJSON();
    expect(tree).toMatchSnapshot();
});