import CreatableSelectMenu from './CreatableSelectMenu';
import type { Meta, StoryObj } from '@storybook/react';

const meta: Meta<typeof CreatableSelectMenu> = {
  title: 'Components/SelectMenu/CreatableSelectMenu',
  component: CreatableSelectMenu,
};

export default meta;

type Story = StoryObj<typeof CreatableSelectMenu>;

//TODO: fix this story
export const CreatableSelectMenuStory: Story = {
  args: {
    isMulti: false,
    id: 'someId',
    labelText: 'plants',
    options: ['tomato', 'zucchini'],
  },
};
