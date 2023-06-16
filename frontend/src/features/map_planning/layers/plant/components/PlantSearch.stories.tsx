import { PlantSearch } from './PlantSearch';
import type { Meta, StoryObj } from '@storybook/react';

const meta: Meta<typeof PlantSearch> = {
  component: PlantSearch,
  decorators: [
    (Story) => (
      <div style={{ width: '400px' }}>
        <Story />
      </div>
    ),
  ],
};

export default meta;

type Story = StoryObj<typeof PlantSearch>;

export const PlantSearchStory: Story = {
  args: {},
};
