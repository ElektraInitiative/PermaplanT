import { ButtonVariant } from '../Button/SimpleButton';
import SimpleButton from '../Button/SimpleButton';
import { MemoryRouter, MemoryRouter as Router } from 'react-router-dom';
import renderer from 'react-test-renderer';

it('renders correctly for primary base variant', () => {
  const tree = renderer
    .create(
      <MemoryRouter>
        <SimpleButton variant={ButtonVariant.primaryBase} />
      </MemoryRouter>,
    )
    .toJSON();
  expect(tree).toMatchSnapshot();
});

it('renders correctly for secondary base variant', () => {
  const tree = renderer
    .create(
      <MemoryRouter>
        <SimpleButton variant={ButtonVariant.secondaryBase} />
      </MemoryRouter>,
    )
    .toJSON();
  expect(tree).toMatchSnapshot();
});

it('renders correctly for primary container variant', () => {
  const tree = renderer
    .create(
      <MemoryRouter>
        <SimpleButton variant={ButtonVariant.primaryContainer} />
      </MemoryRouter>,
    )
    .toJSON();
  expect(tree).toMatchSnapshot();
});

it('renders correctly for secondary container variant', () => {
  const tree = renderer
    .create(
      <MemoryRouter>
        <SimpleButton variant={ButtonVariant.secondaryContainer} />
      </MemoryRouter>,
    )
    .toJSON();
  expect(tree).toMatchSnapshot();
});
