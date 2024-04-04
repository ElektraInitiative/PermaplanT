import type { Meta, StoryObj } from '@storybook/react';
import { NamedSlider } from './NamedSlider';

const meta: Meta<typeof NamedSlider> = {
  title: 'Components/Slider/NamedSlider',
  component: NamedSlider,
  argTypes: { onChange: { action: 'value changed' } },
};

export default meta;

type Story = StoryObj<typeof NamedSlider>;

export const Slider: Story = {
  args: {
    children: 'Slider Name',
  },
};
