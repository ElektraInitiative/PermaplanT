import type { Meta, StoryObj } from '@storybook/react';
import WidePageLayout from './WidePageLayout';

const meta: Meta<typeof WidePageLayout> = {
  title: 'Components/Layout/WidePageLayout',
  component: WidePageLayout,
};

export default meta;

type Story = StoryObj<typeof WidePageLayout>;

export const WidePageLayoutStory: Story = {
  args: {
    styleNames: "bg-neutral-200",
    children: <div className='bg-neutral-300 w-full h-32'>test</div>
  },
};
