import { FormWrapper } from '../../__test_utils__/utils';
import CreatableSelectMenu from './CreatableSelectMenu';
import { render, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import renderer from 'react-test-renderer';

it('renders correctly', () => {
  const tree = renderer
    .create(
      <MemoryRouter>
        <FormWrapper>
          <CreatableSelectMenu id="test" labelText="Some Label" options={[]} />
        </FormWrapper>
      </MemoryRouter>,
    )
    .toJSON();
  expect(tree).toMatchSnapshot();
});

it('calls onInputChange on input change', async () => {
  const callback = vi.fn();

  const { getByRole } = render(
    <MemoryRouter>
      <FormWrapper>
        <CreatableSelectMenu
          id="test"
          labelText="Test"
          placeholder="Test"
          options={[]}
          onInputChange={callback}
        />
      </FormWrapper>
    </MemoryRouter>,
  );

  await act(async () => {
    await userEvent.click(getByRole('combobox'));
    await userEvent.paste('Hello World!');
  });

  expect(callback).toBeCalled();
  expect(callback).toBeCalledWith('Hello World!');
});

it('calls onChange on input change', async () => {
  const callback = vi.fn();
  const { getByRole } = render(
    <MemoryRouter>
      <FormWrapper>
        <CreatableSelectMenu
          id="test"
          labelText="Test"
          placeholder="Test"
          options={[]}
          onChange={callback}
        />
      </FormWrapper>
    </MemoryRouter>,
  );

  await act(async () => {
    await userEvent.click(getByRole('combobox'));
    await userEvent.paste('Hello World!');
  });

  expect(callback).toBeCalled();
});

it('calls handleOptionsChange on options change', async () => {
  const callback = vi.fn();
  const { getByRole, getByText } = render(
    <MemoryRouter>
      <FormWrapper>
        <CreatableSelectMenu
          id="test"
          labelText="Test"
          placeholder="Test"
          options={[{ value: 'foo', label: 'foo' }]}
          handleOptionsChange={callback}
        />
      </FormWrapper>
    </MemoryRouter>,
  );

  await act(async () => {
    await userEvent.click(getByRole('combobox'));
    await userEvent.paste('fo');
    await userEvent.click(getByText('foo'));
  });

  expect(callback).toBeCalled();
});

it('creates new option if none exists', async () => {
  const callback = vi.fn();
  const { getByRole } = render(
    <MemoryRouter>
      <FormWrapper>
        <CreatableSelectMenu
          id="test"
          labelText="Test"
          placeholder="Test"
          options={[{ value: 'foo', label: 'foo' }]}
          handleOptionsChange={callback}
        />
      </FormWrapper>
    </MemoryRouter>,
  );

  await act(async () => {
    await userEvent.click(getByRole('combobox'));
    await userEvent.keyboard('does not exist{Enter}');
  });

  const first_arg = {
    __isNew__: true,
    label: 'does not exist',
    value: 'does not exist',
  };
  const second_arg = {
    action: 'create-option',
    name: 'test',
    option: {
      __isNew__: true,
      label: 'does not exist',
      value: 'does not exist',
    },
  };
  expect(callback).toBeCalledWith(first_arg, second_arg);
});
