import SimpleFormInput from './SimpleFormInput';
import type { Meta, StoryObj } from '@storybook/react';

const meta: Meta<typeof SimpleFormInput> = {
  title: 'Components/Form/SelectMenu/SimpleFormInput',
  component: SimpleFormInput,
  decorators: [
    (Story) => (
      <div className="h-44 w-full">
        <Story />
      </div>
    ),
  ],
};

export default meta;

type Story = StoryObj<typeof SimpleFormInput>;

export const Default: Story = {
  args: {
    id: 'someId',
    labelContent: 'input',
    placeholder: 'Please put your text here!',
  },
  render: (args) => <SimpleFormInput {...args} />,
};
