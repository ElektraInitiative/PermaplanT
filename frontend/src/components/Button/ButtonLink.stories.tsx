import type { Meta, StoryObj } from '@storybook/react';
import { reactRouterDecorator } from '@/utils/stories/react-router-decorators';
import ButtonLink from './ButtonLink';

const meta: Meta<typeof ButtonLink> = {
  title: 'Components/Button/ButtonLink',
  component: ButtonLink,
  decorators: [reactRouterDecorator],
};

export default meta;

type Story = StoryObj<typeof ButtonLink>;

export const Default: Story = {
  args: {
    title: 'Link',
    to: '#',
  },
};
