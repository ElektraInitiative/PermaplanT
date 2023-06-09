import NavContainer from './NavContainer';
import { reactRouterDecorator } from '@/utils/stories/react-router-decorators';
import type { Meta, StoryObj } from '@storybook/react';

const meta: Meta<typeof NavContainer> = {
  title: 'Components/Layout/NavContainer',
  component: NavContainer,
  decorators: [reactRouterDecorator],
};

export default meta;

type Story = StoryObj<typeof NavContainer>;

export const NavContainerStory: Story = {
  args: {},
};
