import type { Meta, StoryObj } from '@storybook/react';
import { FormProvider, useForm } from 'react-hook-form';
import { DebouncedSimpleFormInput } from '@/components/Form/DebouncedSimpleFormInput';

const meta: Meta<typeof DebouncedSimpleFormInput> = {
  title: 'Components/Form/Input/DebouncedSimpleFormInput',
  component: DebouncedSimpleFormInput,
  decorators: [
    (Story) => {
      const formInfo = useForm({
        defaultValues: {
          input: 'erro',
        },
        resolver: (values) => {
          if (values.input === 'error') {
            return {
              values,
              errors: {
                input: 'Input is required',
              },
            };
          }

          return {
            values,
            errors: {},
          };
        },
      });

      return (
        <FormProvider {...formInfo}>
          <Story />
        </FormProvider>
      );
    },
  ],
};

export default meta;

type Story = StoryObj<typeof DebouncedSimpleFormInput>;

export const Default: Story = {
  args: {
    id: 'input',
    placeholder: 'Placeholder',
  },
  render: (args) => <DebouncedSimpleFormInput {...args} />,
};
