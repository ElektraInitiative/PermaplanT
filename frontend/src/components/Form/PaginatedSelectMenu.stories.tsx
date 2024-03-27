import type { Meta, StoryObj } from '@storybook/react';
import { ComponentProps } from 'react';
import { useForm } from 'react-hook-form';
import PaginatedSelectMenu from '@/components/Form/PaginatedSelectMenu';

const meta: Meta<typeof PaginatedSelectMenu> = {
  title: 'Components/Form/SelectMenu/PaginatedSelectMenu',
  component: PaginatedSelectMenu,
  decorators: [
    (Story) => (
      <div className="h-44 w-full">
        <Story />
      </div>
    ),
  ],
};

export default meta;

type Story = StoryObj<typeof PaginatedSelectMenu>;

export const Default: Story = {
  args: {
    isMulti: false,
    id: 'someId',
    labelText: 'Amphibians',
    loadOptions: () => ({
      options: [
        { label: 'Leaf green tree frog (Ranoidea phyllochroa)', value: 'Treefrog' },
        { label: 'Red back salamander (Plethodon cinereus)', value: 'Salamander' },
        { label: 'Alipne Newt (Ichthyosaura alpestris)', value: 'Newt' },
      ],
      hasMore: false,
      additional: { pageNumber: 0 },
    }),
  },
  render: (args) => <SelectHookFormWrapper {...args} />,
};

type WrapperProps = Omit<ComponentProps<typeof PaginatedSelectMenu>, 'control'>;

function SelectHookFormWrapper(props: WrapperProps) {
  const { control } = useForm();
  return <PaginatedSelectMenu {...props} control={control} />;
}
