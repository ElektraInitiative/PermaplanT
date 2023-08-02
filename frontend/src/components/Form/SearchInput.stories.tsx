import SearchInput from './SearchInput';
import type { Meta, StoryObj } from '@storybook/react';

const meta: Meta<typeof SearchInput> = {
  title: 'Components/Form/SearchInput',
  component: SearchInput,
};

export default meta;

type Story = StoryObj<typeof SearchInput>;

export const SearchInputStory: Story = {
  args: {},
};
