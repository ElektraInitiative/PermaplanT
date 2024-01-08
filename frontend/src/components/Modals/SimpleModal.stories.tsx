import type { Meta, StoryObj } from '@storybook/react';
import { ComponentType } from 'react';
import SimpleModal from './SimpleModal';

const meta: Meta<typeof SimpleModal> = {
  title: 'Components/Modals/SimpleModal',
  component: SimpleModal,
  decorators: [
    (Story: ComponentType) => (
      <div className="h-screen">
        <Story />
      </div>
    ),
  ],
};

export default meta;

type Story = StoryObj<typeof SimpleModal>;

export const SimpleModalStory: Story = {
  args: {
    title: 'some prompt',
    body: 'Is blue your favorite color?',
    show: true,
    submitBtnTitle: 'yes',
    cancelBtnTitle: 'no',
  },
};
