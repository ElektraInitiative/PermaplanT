import type { Meta, StoryObj } from '@storybook/react';
import { PlantListItem } from './PlantListItem';
import { PlantSuggestionList } from './PlantSuggestionList';

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

export const InPlantSuggestionList: Story = {
  args: {
    ...Default.args,
  },
  render: (args) => (
    <PlantSuggestionList
      header="A List of Plants"
      isLoading={false}
      noContentElement={<div>No Content</div>}
    >
      {Array(5)
        .fill(0)
        .map((_, i) => (
          <PlantListItem {...args} key={i} />
        ))}
    </PlantSuggestionList>
  ),
};
