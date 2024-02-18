import type { Meta, StoryObj } from '@storybook/react';
import TimelineDatePicker from './TimelineDatePicker';

const meta: Meta<typeof TimelineDatePicker> = {
  component: TimelineDatePicker,
  argTypes: {
    onSelectDate: { action: 'onSelectDate' },
  },
};
export default meta;

type Story = StoryObj<typeof TimelineDatePicker>;

export const Default: Story = {
  args: {},
};
