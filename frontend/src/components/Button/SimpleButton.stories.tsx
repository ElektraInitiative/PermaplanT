import type { Meta, StoryObj } from '@storybook/react';
import SimpleButton, { ButtonVariant } from './SimpleButton';

const meta: Meta<typeof SimpleButton> = {
  title: 'Components/Button/SimpleButton',
  component: SimpleButton,
};

export default meta;

type Story = StoryObj<typeof SimpleButton>;

export const PrimaryBase: Story = {
  args: {
    variant: ButtonVariant.primaryBase,
    children: 'Simple Button',
  },
};

export const PrimaryContainer: Story = {
  args: {
    ...PrimaryBase.args,
    variant: ButtonVariant.primaryContainer,
  },
};

export const SecondaryBase: Story = {
  args: {
    ...PrimaryBase.args,
    variant: ButtonVariant.secondaryBase,
  },
};

export const SecondaryContainer: Story = {
  args: {
    ...PrimaryBase.args,
    variant: ButtonVariant.secondaryContainer,
  },
};
