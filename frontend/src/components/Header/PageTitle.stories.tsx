import type { Meta, StoryObj } from '@storybook/react';
import PageTitle from './PageTitle';

const meta: Meta<typeof PageTitle> = {
  title: 'Components/Header/PageTitle',
  component: PageTitle,
};

export default meta;

type Story = StoryObj<typeof PageTitle>;

export const PageTitleStory: Story = {
  args: {
    title: 'I love Permaculture!',
  },
};
