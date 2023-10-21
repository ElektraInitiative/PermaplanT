import { PlantAndSeedSearch } from './PlantAndSeedSearch';
import type { Meta, StoryObj } from '@storybook/react';

const meta: Meta<typeof PlantAndSeedSearch> = {
  component: PlantAndSeedSearch,
  decorators: [
    (Story) => (
      <div style={{ width: '400px' }}>
        <Story />
      </div>
    ),
  ],
};

export default meta;

type Story = StoryObj<typeof PlantAndSeedSearch>;

export const PlantSearchStory: Story = {
  args: {},
};
