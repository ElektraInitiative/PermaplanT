import { PlantListItem } from './PlantListItem';
import { PlantSuggestionList } from './PlantSuggestionList';
import type { Meta, StoryObj } from '@storybook/react';

const meta: Meta<typeof PlantSuggestionList> = {
  component: PlantSuggestionList,
  decorators: [
    (Story) => (
      <div className="w-100 flex justify-center">
        <div className="w-96">
          <Story />
        </div>
      </div>
    ),
  ],
};

export default meta;

type Story = StoryObj<typeof PlantSuggestionList>;

export const Default: Story = {
  args: {
    header: 'Plant List',
    isLoading: false,
    noContentElement: <div>No Content</div>,
    children: Array(5)
      .fill(0)
      .map((_, i) => (
        <PlantListItem
          plant={{
            id: i,
            unique_name: 'Acer pseudoplatanus',
            common_name_en: ['Sycamore maple'],
          }}
          key={i}
          onClick={() => {
            console.log('clicked');
          }}
        />
      )),
  },
};

export const NoContent: Story = {
  args: {
    ...Default.args,
    children: null,
  },
};

export const Loading: Story = {
  args: {
    ...Default.args,
    isLoading: true,
  },
};
