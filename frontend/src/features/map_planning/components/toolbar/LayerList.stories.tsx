import type { Meta, StoryObj } from '@storybook/react';
import { LayerList } from './LayerList';

const meta: Meta<typeof LayerList> = {
  component: LayerList,
};

export default meta;

type Story = StoryObj<typeof LayerList>;

export const LayerListStory: Story = {
  args: {},
};
