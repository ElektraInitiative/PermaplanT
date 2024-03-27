import type { Meta, StoryObj } from '@storybook/react';
import { ComponentType } from 'react';
import ImageModal from './ImageModal';

const meta: Meta<typeof ImageModal> = {
  title: 'Components/Modals/ImageModal',
  component: ImageModal,
  decorators: [
    (Story: ComponentType) => (
      <div className="h-screen">
        <Story />
      </div>
    ),
  ],
};

export default meta;

type Story = StoryObj<typeof ImageModal>;

export const ImageModalStory: Story = {
  args: {
    title: 'some image',
    body: (
      <svg height="100" width="100">
        <circle cx="50" cy="50" r="40" stroke="black" strokeWidth="3" fill="red" />
      </svg>
    ),
    show: true,
  },
};
