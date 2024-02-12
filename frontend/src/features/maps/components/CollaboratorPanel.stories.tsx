import { Meta, StoryObj } from '@storybook/react';
import PageLayout from '@/components/Layout/PageLayout';
import { CollaboratorPanel } from './CollaboratorPanel';

const meta: Meta<typeof CollaboratorPanel> = {
  title: 'Components/CollaboratorPanel',
  component: CollaboratorPanel,
  argTypes: {
    handleSearch: { action: 'handleSearch' },
  },
  decorators: [
    (Story) => (
      <PageLayout>
        <Story />
      </PageLayout>
    ),
  ],
};

export default meta;

type Story = StoryObj<typeof CollaboratorPanel>;

export const Default: Story = {
  args: {
    collaborators: ['paul', 'john', 'ringo', 'george'],
    userSearchResults: ['test'],
  },
};
