import TimelineDatePicker from './TimelineDatePicker';
import type { Meta, StoryObj } from '@storybook/react';

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
