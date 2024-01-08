import type { Meta, StoryObj } from '@storybook/react';
import { reactRouterDecorator } from '@/utils/stories/react-router-decorators';
import { LoadingSpinner } from './LoadingSpinner';

const meta: Meta<typeof LoadingSpinner> = {
  title: 'Components/LoadingSpinner/LoadingSpinner',
  component: LoadingSpinner,
  decorators: [reactRouterDecorator],
};

export default meta;

type Story = StoryObj<typeof LoadingSpinner>;

export const LoadingSpinnerStory: Story = {
  args: {},
};
