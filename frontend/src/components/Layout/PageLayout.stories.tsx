import { reactRouterDecorator } from '@/utils/stories/react-router-decorators';
import type { Meta, StoryObj } from '@storybook/react';
import PageLayout from './PageLayout';

const meta: Meta<typeof PageLayout> = {
  title: 'Components/Layout/PageLayout',
  component: PageLayout,
  decorators: [reactRouterDecorator],
};

export default meta;

type Story = StoryObj<typeof PageLayout>;

export const PageLayoutStory: Story = {
  args: {
    styleNames: "bg-neutral-200",
    children: <div className='bg-neutral-300 w-full h-32'>test</div>
  },
};
