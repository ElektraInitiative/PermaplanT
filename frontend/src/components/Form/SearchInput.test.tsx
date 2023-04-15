import {render} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import renderer from 'react-test-renderer';
import SearchInput from './SearchInput';
import {MemoryRouter} from 'react-router-dom';

/**
 * @jest-environment jsdom
 */

it('renders correctly', () => {
    const tree = renderer
        .create(<MemoryRouter><SearchInput placeholder='Test' handleSearch={() => {}}/></MemoryRouter>)
        .toJSON();
    expect(tree).toMatchSnapshot();
});

it('calls handleSearch on input change', async () => {
    const {getByPlaceholderText} = render(
        <MemoryRouter>
            <SearchInput placeholder='Test' handleSearch={(event) => {expect(event.target.value).toBe('Hello World!')}}/>
        </MemoryRouter>
    );
    
    await userEvent.click(getByPlaceholderText('Test'));
    await userEvent.paste('Hello World!');
});