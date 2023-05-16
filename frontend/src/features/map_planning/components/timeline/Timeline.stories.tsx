import { Timeline } from './Timeline';
import type { Meta, StoryObj } from '@storybook/react';

const meta: Meta<typeof Timeline> = {
  component: Timeline,
  argTypes: {
    onSelectDate: { action: 'onSelectDate' },
  },
};

export default meta;

type Story = StoryObj<typeof Timeline>;

export const Default: Story = {
  args: {},
};
