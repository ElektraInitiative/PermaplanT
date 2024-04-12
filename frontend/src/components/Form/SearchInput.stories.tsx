import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import SearchInput from './SearchInput';

const meta: Meta<typeof SearchInput> = {
  title: 'Components/Form/Input/SearchInput',
  component: SearchInput,
};

export default meta;

type Story = StoryObj<typeof SearchInput>;

export const SearchInputStory: Story = {
  args: {},
};

const items = ['Search Item 1', 'Search Item 2', 'Search Item 3'];
export const SearchInputStoryWithSearchItems: Story = {
  render: () => {
    // eslint-disable-next-line react-hooks/rules-of-hooks -- workaround for storybook, because render is not a function component per se
    const [searchTerm, setSearchTerm] = useState('');

    const handleSearch = (value: string) => {
      setSearchTerm(value);
    };

    return (
      <>
        <SearchInput handleSearch={handleSearch} />
        <ul>
          {items
            .filter((i) => i.includes(searchTerm))
            .map((item) => (
              <li key={item}>{item}</li>
            ))}
        </ul>
      </>
    );
  },
  args: {},
};
