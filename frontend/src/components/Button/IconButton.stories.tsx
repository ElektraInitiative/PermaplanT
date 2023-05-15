import IconButton from './IconButton';
import { reactRouterDecorator } from '@/utils/stories/react-router-decorators';
import type { Meta, StoryObj } from '@storybook/react';
import { ReactComponent as PlantIcon } from '@/icons/plant.svg';

const meta: Meta<typeof IconButton> = {
  title: 'Components/Button/IconButton',
  component: IconButton,
  decorators: [reactRouterDecorator],
};

export default meta;

type Story = StoryObj<typeof IconButton>;

export const Default: Story = {
  args: {
    children: <PlantIcon />
  },
};
