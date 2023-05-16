import ModalContainer from './ModalContainer';
import type { Meta, StoryObj } from '@storybook/react';
import { ComponentType } from 'react';

const meta: Meta<typeof ModalContainer> = {
  title: 'Components/Modals/ModalContainer',
  component: ModalContainer,
  decorators: [
    (Story: ComponentType) => (
      <div className="h-screen">
        <Story />
      </div>
    ),
  ],
};

export default meta;

type Story = StoryObj<typeof ModalContainer>;

export const ModalContainerStory: Story = {
  args: {},
};
