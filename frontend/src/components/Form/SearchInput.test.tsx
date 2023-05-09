import SearchInput from './SearchInput';
import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import renderer from 'react-test-renderer';

it('renders correctly', () => {
  const callback = jest.fn();
  const tree = renderer
    .create(
      <MemoryRouter>
        <SearchInput placeholder="Test" handleSearch={callback} />
      </MemoryRouter>,
    )
    .toJSON();
  expect(tree).toMatchSnapshot();
});

it('calls handleSearch on input change', async () => {
  const { getByPlaceholderText } = render(
    <MemoryRouter>
      <SearchInput
        placeholder="Test"
        handleSearch={(event) => {
          expect(event.target.value).toBe('Hello World!');
        }}
      />
    </MemoryRouter>,
  );

  await userEvent.click(getByPlaceholderText('Test'));
  await userEvent.paste('Hello World!');
});
