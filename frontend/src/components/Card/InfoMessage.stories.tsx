import InfoMessage, { InfoMessageType } from './InfoMessage';
import type { Meta, StoryObj } from '@storybook/react';

const meta: Meta<typeof InfoMessage> = {
  title: 'Components/Cards/InfoMessage',
  component: InfoMessage,
};

export default meta;

type Story = StoryObj<typeof InfoMessage>;

export const InfoMessageSuccessStory: Story = {
  args: {
    message: 'tomato planted',
    type: InfoMessageType.success,
  },
};

export const InfoMessageFailureStory: Story = {
  args: {
    message: 'tomato planting failed',
    type: InfoMessageType.failure,
  },
};

export const InfoMessageNeutralStory: Story = {
  args: {
    message: 'reminder to plant tomato',
    type: InfoMessageType.neutral,
  },
};
