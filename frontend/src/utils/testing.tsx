import { FormProvider, useForm } from 'react-hook-form';

export interface TestDto {
  foo: string;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const FormWrapper = (props: any) => {
  const formMethods = useForm<TestDto>();

  return <FormProvider {...formMethods}>{props.children}</FormProvider>;
};
