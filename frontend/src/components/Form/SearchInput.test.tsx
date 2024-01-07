import SearchInput, { SHORTCUT_SEARCH_INPUT_RESET, TEST_IDS } from './SearchInput';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ReactElement } from 'react';
import TestRenderer, { ReactTestRendererJSON } from 'react-test-renderer';

const findSearchInput = () => screen.findByTestId(TEST_IDS.SEARCH_INPUT);
const findResetIcon = () => screen.findByTestId(TEST_IDS.RESET_ICON);

describe('SearchInput', () => {
  it('should render correctly', () => {
    const mockHandleSearch = vi.fn();
    const jsonTree = TestRenderer.create(
      <SearchInput handleSearch={mockHandleSearch} />,
    ).toJSON() as ReactTestRendererJSON;

    expect(jsonTree).toMatchSnapshot();
  });

  it('should render the search icon', () => {
    const mockHandleSearch = vi.fn();
    renderComponent(<SearchInput handleSearch={mockHandleSearch} />);

    expect(screen.getByTestId(TEST_IDS.SEARCH_ICON)).toBeInTheDocument();
  });

  it('should render the search input field', () => {
    const mockHandleSearch = vi.fn();
    renderComponent(<SearchInput handleSearch={mockHandleSearch} />);

    expect(screen.getByTestId(TEST_IDS.SEARCH_INPUT)).toBeInTheDocument();
  });

  it('should only render the search reset icon when a search term is entered', async () => {
    const mockHandleSearch = vi.fn();
    const { user } = renderComponent(<SearchInput handleSearch={mockHandleSearch} />);
    const searchInputField = await findSearchInput();

    expect(screen.queryByTestId(TEST_IDS.RESET_ICON)).not.toBeInTheDocument();

    await waitFor(() => user.type(searchInputField, 'Tomato'));

    expect(await findResetIcon()).toBeInTheDocument();
  });

  it('should hide the search reset icon again when the search input field is manually cleared', async () => {
    const mockHandleSearch = vi.fn();
    const { user } = renderComponent(<SearchInput handleSearch={mockHandleSearch} />);
    const searchInputField = await findSearchInput();

    await waitFor(() => user.type(searchInputField, 'Tomato'));

    const resetIcon = await findResetIcon();
    expect(resetIcon).toBeInTheDocument();

    await waitFor(() => user.clear(searchInputField));

    expect(resetIcon).not.toBeInTheDocument();
  });

  it('should hide the search reset icon again when the search input field is cleared via click on reset icon', async () => {
    const mockHandleSearch = vi.fn();
    const { user } = renderComponent(<SearchInput handleSearch={mockHandleSearch} />);
    const searchInputField = await findSearchInput();

    await waitFor(() => user.type(searchInputField, 'Tomato'));

    const resetIcon = await findResetIcon();
    expect(resetIcon).toBeInTheDocument();

    await waitFor(() => user.click(resetIcon));

    expect(resetIcon).not.toBeInTheDocument();
  });

  it('should clear the search input field when reset icon is clicked', async () => {
    const mockHandleSearch = vi.fn();
    const { user } = renderComponent(<SearchInput handleSearch={mockHandleSearch} />);
    const searchInputField = await findSearchInput();

    await waitFor(() => user.type(searchInputField, 'Tomato'));

    expect(searchInputField).toHaveValue('Tomato');

    const resetIcon = await findResetIcon();
    await waitFor(() => user.click(resetIcon));

    expect(searchInputField).toHaveValue('');
  });

  it('should clear the search input field when shortcut is used', async () => {
    const mockHandleSearch = vi.fn();
    const { user } = renderComponent(<SearchInput handleSearch={mockHandleSearch} />);
    const searchInputField = await findSearchInput();

    await waitFor(() => user.type(searchInputField, 'Tomato'));

    expect(searchInputField).toHaveValue('Tomato');

    await waitFor(() => user.keyboard(`{${SHORTCUT_SEARCH_INPUT_RESET}}`));

    expect(searchInputField).toHaveValue('');
  });

  it('should call passed search handler with current search term', async () => {
    const mockHandleSearch = vi.fn();
    const { user } = renderComponent(<SearchInput handleSearch={mockHandleSearch} />);
    const searchInputField = await findSearchInput();

    await waitFor(() => user.type(searchInputField, 'Tomato'));

    expect(mockHandleSearch).toHaveBeenCalledWith('Tomato');
  });
});

function renderComponent(component: ReactElement) {
  return {
    user: userEvent.setup(),
    ...render(component),
  };
}
