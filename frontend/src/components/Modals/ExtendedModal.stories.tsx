import type { Meta, StoryObj } from '@storybook/react';
import { ComponentType } from 'react';
import ExtendedModal from './ExtendedModal';

const meta: Meta<typeof ExtendedModal> = {
  title: 'Components/Modals/ExtendedModal',
  component: ExtendedModal,
  decorators: [
    (Story: ComponentType) => (
      <div className="h-screen">
        <Story />
      </div>
    ),
  ],
};

export default meta;

type Story = StoryObj<typeof ExtendedModal>;

export const ExtendedModalStory: Story = {
  args: {
    title: 'An interesting Title',
    body: 'What is your favorite cephalopod?',
    show: true,
    firstActionBtnTitle: 'Cuttlefish',
    secondActionBtnTitle: 'Octopus',
    cancelBtnTitle: 'Cancel',
  },
};
