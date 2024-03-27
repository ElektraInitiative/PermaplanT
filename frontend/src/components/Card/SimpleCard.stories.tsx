import type { Meta, StoryObj } from '@storybook/react';
import SimpleCard from './SimpleCard';

const meta: Meta<typeof SimpleCard> = {
  title: 'Components/Cards/SimpleCard',
  component: SimpleCard,
};

export default meta;

type Story = StoryObj<typeof SimpleCard>;

export const SimpleCardStory: Story = {
  args: {
    title: 'The Tomato',
    body: 'The tomato is a versatile fruit with a vibrant red color and a refreshing balance of sweetness and acidity, making it a popular ingredient in various culinary dishes around the world. Its rich flavor and nutritional value have contributed to its widespread cultivation and consumption.',
  },
};
