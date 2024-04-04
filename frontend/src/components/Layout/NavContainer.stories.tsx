import type { Meta, StoryObj } from '@storybook/react';
import { reactRouterDecorator } from '@/utils/stories/react-router-decorators';
import NavContainer from './NavContainer';

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
