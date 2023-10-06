import IconButton, { ButtonVariant } from './IconButton';
import { reactRouterDecorator } from '@/utils/stories/react-router-decorators';
import { ReactComponent as PlantIcon } from '@public/icons/plant.svg';
import type { Meta, StoryObj } from '@storybook/react';

const meta: Meta<typeof IconButton> = {
  title: 'Components/Button/IconButton',
  component: IconButton,
  decorators: [reactRouterDecorator],
};

export default meta;

type Story = StoryObj<typeof IconButton>;

export const Primary: Story = {
  args: {
    variant: ButtonVariant.primary,
    children: <PlantIcon />,
  },
};

export const Secondary: Story = {
  args: {
    ...Primary.args,
    variant: ButtonVariant.secondary,
  },
};
