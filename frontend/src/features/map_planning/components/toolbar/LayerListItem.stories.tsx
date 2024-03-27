import type { Meta, StoryObj } from '@storybook/react';
import { LayerListItem } from './LayerListItem';

const meta: Meta<typeof LayerListItem> = {
  component: LayerListItem,
};

export default meta;

type Story = StoryObj<typeof LayerListItem>;

export const LayerListItemStory: Story = {
  args: {},
};
