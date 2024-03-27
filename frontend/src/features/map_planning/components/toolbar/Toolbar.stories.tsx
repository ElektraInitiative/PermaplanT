import type { Meta, StoryObj } from '@storybook/react';
import { ReactNode } from 'react';
import { Toolbar } from './Toolbar';

const meta: Meta<typeof Toolbar> = {
  component: Toolbar,
  decorators: [
    (Story) => (
      <div className="flex h-full">
        <div className="h-full w-full bg-neutral-500">main content</div>
        <Story />
      </div>
    ),
  ],
};

const generateList = (n: number) => {
  const arr: Array<ReactNode> = [];
  for (let index = 0; index < n; index++) {
    arr.push(<li>{index}</li>);
  }
  return arr;
};
export default meta;

type Story = StoryObj<typeof Toolbar>;

export const ToolbarStory: Story = {
  args: {
    position: 'right',
    contentTop: (
      <div className="h-full w-full">
        <ul>{generateList(100)}</ul>
      </div>
    ),
    contentBottom: (
      <div className="w-full">
        <ul>{generateList(20)}</ul>
      </div>
    ),
  },
};
