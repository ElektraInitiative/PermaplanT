import { LayerListItem } from './LayerListItem';
import type { Meta, StoryObj } from '@storybook/react';

const meta: Meta<typeof LayerListItem> = {
  component: LayerListItem,
};

export default meta;

type Story = StoryObj<typeof LayerListItem>;

export const LayerListItemStory: Story = {
  args: {},
};
