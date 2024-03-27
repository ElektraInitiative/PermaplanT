import { Meta, StoryObj } from '@storybook/react';
import { MapCollaboratorDto } from '@/api_types/definitions';
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

const MOCK_COLLABORATORS: MapCollaboratorDto[] = [
  {
    mapId: 1,
    userId: '1',
    username: 'paul',
  },
  {
    mapId: 1,
    userId: '2',
    username: 'john',
  },
  {
    mapId: 1,
    userId: '3',
    username: 'ringo',
  },
  {
    mapId: 1,
    userId: '4',
    username: 'george',
  },
];

export const Default: Story = {
  args: {
    collaborators: MOCK_COLLABORATORS,
    userSearchResults: [{ id: '5', username: 'mick' }],
  },
};
