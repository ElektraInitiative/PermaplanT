import WidePageLayout from './WidePageLayout';
import type { Meta, StoryObj } from '@storybook/react';

const meta: Meta<typeof WidePageLayout> = {
  title: 'Components/Layout/WidePageLayout',
  component: WidePageLayout,
};

export default meta;

type Story = StoryObj<typeof WidePageLayout>;

export const WidePageLayoutStory: Story = {
  args: {
    styleNames: 'bg-neutral-200',
    children: <div className="h-32 w-full bg-neutral-300">test</div>,
  },
};
