import CreatableSelectMenu from './CreatableSelectMenu';
import type { Meta, StoryObj } from '@storybook/react';
import { reactRouterDecorator } from '@/utils/stories/react-router-decorators';

const meta: Meta<typeof CreatableSelectMenu> = {
  title: 'Components/SelectMenu/CreatableSelectMenu',
  component: CreatableSelectMenu,
  decorators: [reactRouterDecorator],
};

export default meta;

type Story = StoryObj<typeof CreatableSelectMenu>;

export const CreatableSelectMenuStory: Story = {
  args: {
    isMulti: false,
    id: 'someId',
    labelText: 'plants',
    options: ['tomato', 'zucchini'],
  },
};
