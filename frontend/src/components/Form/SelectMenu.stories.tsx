import type { Meta, StoryObj } from '@storybook/react';
import { ComponentProps } from 'react';
import { useForm } from 'react-hook-form';
import SelectMenu from './SelectMenu';

const meta: Meta<typeof SelectMenu> = {
  title: 'Components/Form/SelectMenu/SelectMenu',
  component: SelectMenu,
  decorators: [
    (Story) => (
      <div className="h-44 w-full">
        <Story />
      </div>
    ),
  ],
};

export default meta;

type Story = StoryObj<typeof SelectMenu>;

export const Default: Story = {
  args: {
    isMulti: false,
    id: 'someId',
    labelText: 'fungi',
    options: [
      { value: 'P', label: 'Penicillium expansum' },
      { value: 'A', label: 'Agaricus bisporus' },
    ],
  },
  render: (args) => <SelectHookFormWrapper {...args} />,
};

type WrapperProps = Omit<ComponentProps<typeof SelectMenu>, 'control'>;

function SelectHookFormWrapper(props: WrapperProps) {
  const { control } = useForm();
  return <SelectMenu {...props} control={control} />;
}
