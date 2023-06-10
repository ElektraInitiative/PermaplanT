import PageLayout from './PageLayout';
import { reactRouterDecorator } from '@/utils/stories/react-router-decorators';
import type { Meta, StoryObj } from '@storybook/react';

const meta: Meta<typeof PageLayout> = {
  title: 'Components/Layout/PageLayout',
  component: PageLayout,
  decorators: [reactRouterDecorator],
};

export default meta;

type Story = StoryObj<typeof PageLayout>;

export const PageLayoutStory: Story = {
  args: {
    styleNames: 'bg-neutral-200',
    children: <div className="h-32 w-full bg-neutral-300">test</div>,
  },
};
