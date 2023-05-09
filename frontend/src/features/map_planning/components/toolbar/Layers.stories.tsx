import { Layers } from './Layers';
import type { Meta, StoryObj } from '@storybook/react';

const meta: Meta<typeof Layers> = {
  component: Layers,
};

export default meta;

type Story = StoryObj<typeof Layers>;

export const LayerStory: Story = {
  args: {},
};
