import { LayerSettings } from './LayerSettings';
import type { Meta, StoryObj } from '@storybook/react';

const meta: Meta<typeof LayerSettings> = {
  component: LayerSettings,
};

export default meta;

type Story = StoryObj<typeof LayerSettings>;

export const LayerSettingsStory: Story = {
  args: {},
};
