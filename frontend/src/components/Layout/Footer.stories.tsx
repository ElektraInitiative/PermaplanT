import Footer from './Footer';
import { reactRouterDecorator } from '@/utils/stories/react-router-decorators';
import type { Meta, StoryObj } from '@storybook/react';

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
