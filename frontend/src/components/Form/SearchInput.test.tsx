import SearchInput, { SHORTCUT_SEARCH_INPUT_RESET, TEST_IDS } from './SearchInput';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ChangeEvent, ReactElement } from 'react';
import TestRenderer, { ReactTestRendererJSON } from 'react-test-renderer';

const mockHandleSearch = vi.fn();

describe('SearchInput', () => {
  it('should render correctly', () => {
    const jsonTree = TestRenderer.create(
      <SearchInput handleSearch={mockHandleSearch} />,
    ).toJSON() as ReactTestRendererJSON;

    expect(jsonTree).toMatchSnapshot();
  });

  it('should render the search icon', () => {
    renderComponent(<SearchInput handleSearch={mockHandleSearch} />);

    expect(screen.getByTestId(TEST_IDS.SEARCH_ICON)).toBeInTheDocument();
  });

  it('should render the search input field', () => {
    renderComponent(<SearchInput handleSearch={mockHandleSearch} />);

    expect(screen.getByTestId(TEST_IDS.SEARCH_INPUT)).toBeInTheDocument();
  });

  it('should only render the search reset icon when a search term is entered', async () => {
    const { user } = renderComponent(<SearchInput handleSearch={mockHandleSearch} />);

    expect(screen.queryByTestId(TEST_IDS.RESET_ICON)).not.toBeInTheDocument();

    await user.type(screen.getByTestId(TEST_IDS.SEARCH_INPUT), 'Tomato');

    expect(screen.getByTestId(TEST_IDS.RESET_ICON)).toBeInTheDocument();
  });

  it('should hide the search reset icon again when the search input field is manually cleared', async () => {
    const { user } = renderComponent(<SearchInput handleSearch={mockHandleSearch} />);

    await user.type(screen.getByTestId(TEST_IDS.SEARCH_INPUT), 'Tomato');

    expect(screen.getByTestId(TEST_IDS.RESET_ICON)).toBeInTheDocument();

    await user.clear(screen.getByTestId(TEST_IDS.SEARCH_INPUT));

    expect(screen.queryByTestId(TEST_IDS.RESET_ICON)).not.toBeInTheDocument();
  });

  it('should hide the search reset icon again when the search input field is cleared via click on reset icon', async () => {
    const { user } = renderComponent(<SearchInput handleSearch={mockHandleSearch} />);

    await user.type(screen.getByTestId(TEST_IDS.SEARCH_INPUT), 'Tomato');

    expect(screen.getByTestId(TEST_IDS.RESET_ICON)).toBeInTheDocument();

    await user.click(screen.getByTestId(TEST_IDS.RESET_ICON) as Element);

    expect(screen.queryByTestId(TEST_IDS.RESET_ICON)).not.toBeInTheDocument();
  });

  it('should clear the search input field when reset icon is clicked', async () => {
    const { user } = renderComponent(<SearchInput handleSearch={mockHandleSearch} />);
    const searchInputField = screen.getByTestId(TEST_IDS.SEARCH_INPUT);

    await user.type(searchInputField, 'Tomato');

    expect(searchInputField).toHaveValue('Tomato');

    await user.click(screen.getByTestId(TEST_IDS.RESET_ICON) as Element);

    expect(searchInputField).toHaveValue('');
  });

  it('should clear the search input field when shortcut is used', async () => {
    const { user } = renderComponent(<SearchInput handleSearch={mockHandleSearch} />);
    const searchInputField = screen.getByTestId(TEST_IDS.SEARCH_INPUT);

    await user.type(searchInputField, 'Tomato');

    expect(searchInputField).toHaveValue('Tomato');

    await user.keyboard(`{${SHORTCUT_SEARCH_INPUT_RESET}}`);

    expect(searchInputField).toHaveValue('');
  });

  it('should call passed search handler with current search term', async () => {
    let searchTerm = '';
    const handleSearch = (event: ChangeEvent<HTMLInputElement>) => {
      searchTerm = event.target.value;
    };
    const { user } = renderComponent(<SearchInput handleSearch={handleSearch} />);

    await user.type(screen.getByTestId(TEST_IDS.SEARCH_INPUT), 'Tomato');

    expect(searchTerm).toBe('Tomato');
  });
});

function renderComponent(component: ReactElement) {
  return {
    user: userEvent.setup(),
    ...render(component),
  };
}
