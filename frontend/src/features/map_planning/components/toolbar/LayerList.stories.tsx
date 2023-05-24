import { LayerList } from './LayerList';
import type { Meta, StoryObj } from '@storybook/react';

const meta: Meta<typeof LayerList> = {
  component: LayerList,
};

export default meta;

type Story = StoryObj<typeof LayerList>;

export const LayerListStory: Story = {
  args: {},
};
