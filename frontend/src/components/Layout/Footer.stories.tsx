import type { Meta, StoryObj } from '@storybook/react';
import { reactRouterDecorator } from '@/utils/stories/react-router-decorators';
import Footer from './Footer';

const meta: Meta<typeof Footer> = {
  title: 'Components/Layout/Footer',
  component: Footer,
  decorators: [reactRouterDecorator],
};

export default meta;

type Story = StoryObj<typeof Footer>;

export const FooterStory: Story = {
  args: {},
};
