import type { Meta, StoryObj } from '@storybook/react';
import { ComponentProps } from 'react';
import { useForm } from 'react-hook-form';
import CreatableSelectMenu from './CreatableSelectMenu';

const meta: Meta<typeof CreatableSelectMenu> = {
  title: 'Components/Form/SelectMenu/CreatableSelectMenu',
  component: CreatableSelectMenu,
  argTypes: {
    handleCreate: { action: 'handleCreate' },
    handleOptionsChange: { action: 'handleOptionsChange' },
  },
  decorators: [
    (Story) => (
      <div className="h-44 w-full">
        <Story />
      </div>
    ),
  ],
};

export default meta;

type Story = StoryObj<typeof CreatableSelectMenu>;

export const Default: Story = {
  args: {
    isMulti: false,
    id: 'someId',
    labelText: 'plants',
    options: [
      { value: 'tomato', label: 'Tomato' },
      { value: 'zucchini', label: 'Zucchini' },
    ],
  },
  render: (args) => <SelectHookFormWrapper {...args} />,
};

type WrapperProps = Omit<ComponentProps<typeof CreatableSelectMenu>, 'control'>;

function SelectHookFormWrapper(props: WrapperProps) {
  const { control } = useForm();
  return <CreatableSelectMenu {...props} control={control} />;
}
