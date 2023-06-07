import Navbar from './Navbar';
import { reactRouterDecorator } from '@/utils/stories/react-router-decorators';
import type { Meta, StoryObj } from '@storybook/react';

const meta: Meta<typeof Navbar> = {
  title: 'Components/Layout/Navbar',
  component: Navbar,
  decorators: [reactRouterDecorator],
};

export default meta;

type Story = StoryObj<typeof Navbar>;

export const NavbarStory: Story = {
  args: {},
};
