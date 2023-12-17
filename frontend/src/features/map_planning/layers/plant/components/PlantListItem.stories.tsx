import { PlantListItem } from './PlantListItem';
import type { Meta, StoryObj } from '@storybook/react';

const meta: Meta<typeof PlantListItem> = {
  component: PlantListItem,
  argTypes: {
    onClick: { action: 'clicked' },
    isHighlighted: { control: 'boolean' },
  },
};

export default meta;

type Story = StoryObj<typeof PlantListItem>;

export const Default: Story = {
  args: {
    plant: {
      id: 1,
      unique_name: 'Acer pseudoplatanus',
      common_name_en: ['Sycamore maple'],
    },
    isHighlighted: false,
  },
};

export const Highlighted: Story = {
  args: {
    ...Default.args,
    isHighlighted: true,
  },
};
