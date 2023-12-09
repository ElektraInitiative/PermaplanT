import { FormWrapper } from '../../__test_utils__/utils';
import PaginatedSelectMenu from './PaginatedSelectMenu';
import { act, render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import renderer from 'react-test-renderer';

it('renders correctly', () => {
  const tree = renderer
    .create(
      <MemoryRouter>
        <FormWrapper>
          <PaginatedSelectMenu
            id="test"
            labelText="Some Label"
            loadOptions={async () => {
              return { options: [], hasMore: false, additional: { pageNumber: 0 } };
            }}
          />
        </FormWrapper>
      </MemoryRouter>,
    )
    .toJSON();
  expect(tree).toMatchSnapshot();
});

it('calls loadOptions on interaction', async () => {
  const loadOptions = vi
    .fn()
    .mockReturnValue({ options: [], hasMore: false, additional: { page: 0 } });

  const { getByRole } = render(
    <MemoryRouter>
      <FormWrapper>
        <PaginatedSelectMenu id="test" labelText="Some Label" loadOptions={loadOptions} />
      </FormWrapper>
    </MemoryRouter>,
  );

  const input = getByRole('combobox');

  await act(async () => {
    await userEvent.click(input);
  });

  expect(loadOptions).toBeCalled();
});
